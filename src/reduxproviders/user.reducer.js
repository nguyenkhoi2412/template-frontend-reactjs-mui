import { createSlice, current, createAsyncThunk } from "@reduxjs/toolkit";
import userServices from "@services/user";
import { storedExtension } from "@utils/helpers";
import storageHandler from "@authentication/storageHandler";

export const FIND_BY_USER = createAsyncThunk(
  "user/findbyuser",
  async (params, thunkAPI) => {
    return await userServices.findByUser(params);
  }
);

export const VALIDATE_USER = createAsyncThunk(
  "user/validate",
  async (params, thunkAPI) => {
    return await userServices.validateUser(params);
  }
);

export const REGISTER_USER = createAsyncThunk(
  "user/register",
  async (params, thunkAPI) => {
    return await userServices.registerUser(params);
  }
);

const currentUser = () => {
  if (localStorage.getItem(storageHandler.DASHBOARD.CURRENT_USER)) {
    return JSON.parse(
      localStorage.getItem(storageHandler.DASHBOARD.CURRENT_USER)
    );
  }

  return {};
};

// init state auth
const initialState = {
  isFetching: false,
  ok: true,
  message: "",
  currentUser: currentUser(),
  language: "en",
};

export const user = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    SIGN_OUT: (state) => {
      localStorage.removeItem(storageHandler.DASHBOARD.CURRENT_USER);
      storedExtension.removeCookie(storageHandler.DASHBOARD.ACCESS_TOKEN);
      storedExtension.removeCookie(storageHandler.DASHBOARD.REFRESH_TOKEN);
      storedExtension.removeCookie(storageHandler.DASHBOARD.VERIFIED_2FA);

      return { ...state, ...initialState };
    },
    SECURE_2FA_UPDATE: (state, action) => {
      const payload = action.payload;

      // update cookie verified code 2fa
      storedExtension.setCookie(
        storageHandler.DASHBOARD.VERIFIED_2FA,
        payload.verified + ""
      );

      return {
        ...state,
      };
    },
  },
  extraReducers: {
    //#region VALIDATE_USER
    [VALIDATE_USER.pending]: (state) => {
      return {
        ...state,
        isFetching: true,
      };
    },
    [VALIDATE_USER.rejected]: (state) => {
      return {
        ...state,
        isFetching: false,
      };
    },
    [VALIDATE_USER.fulfilled]: (state, action) => {
      const response = action.payload;
      const results = response.rs;

      const newState = {
        ...state,
        isFetching: false,
        ok: response.ok,
        message: response.message,
        currentUser: results.currentUser,
      };

      if (response.ok) {
        // save localStore
        localStorage.setItem(
          storageHandler.DASHBOARD.CURRENT_USER,
          JSON.stringify(results.currentUser)
        );

        // save token to cookie
        storedExtension.setCookie(
          storageHandler.DASHBOARD.VERIFIED_2FA,
          results.verified_token + ""
        );

        storedExtension.setCookie(
          storageHandler.DASHBOARD.ACCESS_TOKEN,
          results.access_token
        );
        storedExtension.setCookie(
          storageHandler.DASHBOARD.REFRESH_TOKEN,
          results.refresh_token
        );
      }

      return newState;
    },
    //#endregion
  },
});

// export actions to use
export const { SIGN_OUT, SECURE_2FA_UPDATE } = user.actions;

//#region The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const userState = (state) => state.user;
export const currentUserState = (state) => state.user.currentUser;
//#endregion

export default user.reducer;
import "./_details.scss";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import * as React from "react";
//#region utils support
import { useSnackbar } from "notistack";
import { helpersExtension, objectExtension } from "@utils/helpersExtension";
import { useTranslation } from "react-i18next";
import { gridSpacing } from "@constants";
import FormAccountDetailInfo from "./formAccountDetailInfo";
import severity from "@constants/severity";
//#endregion

// material-ui
import AnimateButton from "@components/mui-ui/extended/animateButton";
import { Stack, Grid, Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";

//#region components
import SubCard from "@components/mui-ui/cards/subCard";
//#endregion

//#region redux provider
import { useDispatch, useSelector } from "react-redux";
import {
  USER_UPDATE_INFO,
  currentUserState,
} from "@reduxproviders/auth.reducer";
import { CHANGE_PROFILE_IMAGE } from "@reduxproviders/file.reducer";
import {
  SHOW_PROGRESSBAR,
  HIDE_PROGRESSBAR,
} from "@components/mui-ui/progressBar/progressBar.reducer";
//#endregion

// ============================|| ACCOUNT DETAIL INFO ||============================ //

const AccountInfo = (props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserState);
  const [file, setFile] = React.useState();
  const [submitting, setSubmitting] = React.useState(false);

  //#region useEffect
  React.useEffect(() => {
    setFile(
      process.env.API_HOSTNAME + "/" + currentUser?.detailInfos?.avatarPath
    );
  }, []);
  //#endregion

  //#region handle events
  const handleOnChangeUploadFile = (event) => {
    if (submitting) return;

    // show pending progressbar
    setSubmitting(true);
    dispatch(SHOW_PROGRESSBAR());

    var file = event.target.files[0];
    const formData = new FormData();
    formData.append("single", file);
    // for upload multiple files
    // for (let i = 0; i < file.length; i++) {
    //   formData.append("multiple", file[i]);
    // }
    helpersExtension.simulateNetworkRequest(100).then(async () => {
      await dispatch(
        CHANGE_PROFILE_IMAGE({
          formData: formData,
          type: "single",
        })
      )
        .unwrap()
        .then((res) => {
          if (res.ok) {
            // change image profile
            const filename = res.rs.filenames[0];
            setFile(process.env.API_HOSTNAME + "/" + filename);

            // update state current user avatar
            updateCurrentUserInfo(filename);
          } else {
            enqueueSnackbar(t("user.uploadProfileFail"), {
              variant: severity.error,
            });
          }
        })
        .catch((error) => {
          dispatch(HIDE_PROGRESSBAR());
          // variant could be success, error, warning, info, or default
          enqueueSnackbar(error, {
            variant: severity.error,
          });
        });
    });
    // var fileBase64 = stringExtension.getImageBase64(file);
    // fileBase64.then((response) => {
    //   if (response.ok) {
    //     setFile(response.d);
    //   } else {
    //     // variant could be success, error, warning, info, or default
    //     enqueueSnackbar(response.message, {
    //       variant: severity.error,
    //     });
    //   }
    // });
  };

  const updateCurrentUserInfo = (filename) => {
    const _currentUser = { ...currentUser };

    // update currentUser avatar
    helpersExtension.simulateNetworkRequest(100).then(async () => {
      const newValues = {
        ...currentUser,
        detailInfos: {
          ...currentUser.detailInfos,
          avatarPath: filename,
        },
      };

      // compare 2 object get diff for update
      let values = objectExtension.getDiff(newValues, _currentUser);
      values._id = currentUser._id;
      await dispatch(USER_UPDATE_INFO(values))
        .unwrap()
        .then((result) => {
          setSubmitting(false);
          dispatch(HIDE_PROGRESSBAR());

          if (result.ok) {
            // variant could be success, error, warning, info, or default
            enqueueSnackbar(t("user.updatesuccess"), {
              variant: severity.success,
            });
          } else {
            // variant could be success, error, warning, info, or default
            enqueueSnackbar(t("user.updatefail") + ". " + result.message, {
              variant: severity.success,
            });
          }
        })
        .catch((error) => {
          setSubmitting(false);
          dispatch(HIDE_PROGRESSBAR());
          // variant could be success, error, warning, info, or default
          enqueueSnackbar(error, {
            variant: severity.error,
          });
        });
    });
  };
  //#endregion

  //#region render content
  const renderAvatarDefault = () => {
    return helpersExtension.checkIsNotNull(
      currentUser?.detailInfos?.avatarPath
    ) ? (
      <></>
    ) : (
      <PersonPinOutlinedIcon />
    );
  };

  //#endregion

  return (
    <React.Fragment>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={4}>
          <SubCard
            title={t("authentication.profilepicture")}
            contentClass={
              helpersExtension.checkIsNotNull(
                currentUser?.detailInfos?.avatarPath
              )
                ? "avatar-container"
                : "avatar-container svg"
            }
          >
            <Grid container spacing={gridSpacing} justifyContent={`center`}>
              <Grid item>
                <Stack spacing={2} alignItems={`center`}>
                  <Avatar
                    alt={
                      currentUser?.detailInfos?.firstName +
                      " " +
                      currentUser?.detailInfos?.lastName
                    }
                    src={file}
                    sx={{
                      width: 100,
                      height: 100,
                    }}
                  >
                    {renderAvatarDefault()}
                  </Avatar>
                  <AnimateButton>
                    <Button
                      disableElevation
                      fullWidth
                      size="large"
                      disabled={submitting}
                      variant="contained"
                      component="label"
                    >
                      <input
                        hidden
                        // multiple
                        type="file"
                        name="single"
                        onChange={handleOnChangeUploadFile}
                      />
                      {t("user.uploadnewimage")}
                    </Button>
                  </AnimateButton>
                </Stack>
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
        <Grid item xs={12} md={8}>
          <SubCard title={t("authentication.accountdetails")}>
            <Grid container spacing={gridSpacing}>
              <FormAccountDetailInfo currentUser={currentUser} />
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default AccountInfo;

import "./app.scss";
import React from "react";
import { useTranslation } from "react-i18next";
import defaultFavicon from "@assets/favicons/default/favicon.ico";
// // import cmsFavicon from "@assets/favicons/dashboard/favicon.ico";
// import surveyFavicon from "@assets/favicons/survey/favicon.ico";
import { SnackbarProvider } from "notistack";
import BuildPagesRoute from "@routes/buildPagesRoute";
import { ThemeProvider } from "@mui/system";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { configBaseTheme } from "@assets/themes/_baseTheme";
import routes from "@routes";
import { CURRENT_MODULES } from "@routes/_modules";
//#region useHooks,components, helper
import IncBackdrop from "@components/mui-ui/backdropSpin";
import IncProgressBar from "@components/mui-ui/progressBar";
//#endregion
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
// import {
//   SITE_GET_BY_NAME,
//   siteState,
//   localeState,
// } from "@providers/site.reducer";
// import { TYPE_GET_BY_SITE } from "@providers/type.reducer";
// import { UPDATE_ENVIROMENT_INFOS } from "@providers/utils/shared.reducer";
import { Helpers } from "@utils/helpers";

const App = () => {
  console.warn = () => {};
  dynamicFavicons();

  const customization = useSelector((state) => state.customization);
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  // const site = useSelector(siteState);
  // const locale = useSelector(localeState);
  const [renderRoutes, setRenderRoutes] = React.useState(routes.buildRoutes());
  const [deviceInfos, setDeviceInfos] = React.useState({
    mobile: false,
    responsive: false,
  });

  const handleResize = Helpers.debounce(() => {
    setDeviceInfos(Helpers.detectEnvironment());
  }, 10);

  //#region useEffect
  //* GET SITE INFO
  React.useEffect(() => {
    i18n.changeLanguage("en-US");
    handleResize();
    // dispatch(SITE_GET_BY_NAME());
  }, []);

  // // React.useEffect(() => {
  // //   if (performance.navigation.type === 1) {
  // //     console.log("This page is reloaded");
  // //   } else {
  // //     console.log("This page is not reloaded");
  // //   }
  // //   window.onbeforeunload = null;
  // //   window.onbeforeunload = function () {
  // //     return true;
  // //   };

  // //   return () => {
  // //     window.onbeforeunload = null;
  // //   };
  // // });

  // //* GET TYPE BY SITE
  // React.useEffect(() => {
  //   if (Helpers.checkIsNotNull(site.d)) {
  //     dispatch(TYPE_GET_BY_SITE(site.d._id));

  //     // set language for i18n
  //     i18n.changeLanguage(locale.lang);
  //     setRenderRoutes(routes.buildRoutes(site.d, locale));
  //   }
  // }, [site.d]);

  // React.useEffect(() => {
  //   dispatch(UPDATE_ENVIROMENT_INFOS(deviceInfos));
  // }, [deviceInfos]);
  //#endregion

  //* window resize
  $(window)
    .off("resize.handleResize")
    .on("resize.handleResize", function () {
      handleResize();
    });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={configBaseTheme(customization)}>
        <CssBaseline />
        <BrowserRouter>
          <IncProgressBar />
          <IncBackdrop />
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Grid container component="main" sx={{ height: "100vh" }}>
              <BuildPagesRoute dataSource={renderRoutes} />
            </Grid>
          </SnackbarProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

const dynamicFavicons = () => {
  // var link = document.querySelector("link[rel~='icon']");
  // if (!link) {
  //   link = document.createElement("link");
  //   link.rel = "shortcut icon";
  //   document.getElementsByTagName("head")[0].appendChild(link);
  // }
  // const { CURRENT_MODULES, MODULES } = routes;
  // switch (CURRENT_MODULES()) {
  //   case MODULES.SURVEY:
  //     link.href = surveyFavicon;
  //     break;
  //   // case MODULES.DASHBOARD:
  //   //   link.href = cmsFavicon;
  //   //   break;
  //   default:
  //     link.href = defaultFavicon;
  //     break;
  // }
  // if (CURRENT_MODULES() !== "") {
  //   document.body.classList.add(CURRENT_MODULES());
  // } else document.body.classList.add("home");
};

import "@/App.css";
import { Route, Routes } from "react-router-dom";
import { AppRoutes } from "@/router";
import { PrivateRoute, RestrictedRoute } from "@/hocs";
import { useAppState, useRefresh } from "@/hooks";
import { Header, NotificationContainer, LoadingScreen } from "@/components";
import {
  LoginPage,
  Page404,
  SellersPage,
  ProfilePage,
  ReceiptsPage,
  ConfirmationsPage,
  DashboardPage,
} from "@/pages";

function App() {
  useRefresh();
  const { authenticate } = useAppState();

  return authenticate.isRefreshing ? (
    <LoadingScreen />
  ) : (
    <>
      <Header />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route
            path={AppRoutes.dashboard}
            element={
              <PrivateRoute
                redirectTo={AppRoutes.login}
                component={<DashboardPage />}
                role=""
              />
            }
          />
          <Route
            path={AppRoutes.login}
            element={
              <RestrictedRoute
                redirectTo={AppRoutes.dashboard}
                component={<LoginPage />}
              />
            }
          />
          <Route
            path={AppRoutes.profile}
            element={
              <PrivateRoute
                redirectTo={AppRoutes.login}
                component={<ProfilePage />}
                role=""
              />
            }
          />
          <Route
            path={AppRoutes.sellers}
            element={
              <PrivateRoute
                redirectTo={AppRoutes.login}
                component={<SellersPage />}
                role="ADMIN"
              />
            }
          />
          <Route
            path={AppRoutes.receipts}
            element={
              <PrivateRoute
                redirectTo={AppRoutes.login}
                component={<ReceiptsPage />}
                role=""
              />
            }
          />
          <Route
            path={AppRoutes.confirmations}
            element={
              <PrivateRoute
                redirectTo={AppRoutes.login}
                component={<ConfirmationsPage />}
                role=""
              />
            }
          />
        </Routes>
      </div>
      <NotificationContainer />
    </>
  );
}

export default App;

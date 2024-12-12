import "@/App.css"
import { Route, Routes } from "react-router-dom"
import { AppRoutes } from "@/router"
import { PrivateRoute, RestrictedRoute } from "@/hocs"
import { useAppState, useRefresh } from "@/hooks"
import { Header, NotificationContainer, LoadingScreen } from "@/components"
import {
  LoginPage,
  Page404,
  SellersPage,
  ProfilePage,
  ReceiptsPage,
  ConfirmationsPage,
  DashboardPage,
} from "@/pages"
import VideoPlayerWithComments from "./Modules/VideoPlayer/video-player-with-comments"
import Dashboard from '@/components/USERDashboard'
import { OrderFlow } from "./components/order-flow"
import { AppSidebar } from './components/app-sidebar'
import { SidebarProvider, SidebarInset } from './components/ui/sidebar'

function App() {
  useRefresh()
  const { authenticate } = useAppState()

  if (authenticate.isRefreshing) {
    return <LoadingScreen />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <Route
                  path={AppRoutes.VideoPlayerWithComments}
                  element={
                    <PrivateRoute
                      redirectTo={AppRoutes.login}
                      component={<VideoPlayerWithComments />}
                      role=""
                    />
                  }
                />
                <Route
                  path={AppRoutes.UserYTdashboard}
                  element={
                    <PrivateRoute
                      redirectTo={AppRoutes.login}
                      component={<Dashboard />}
                      role=""
                    />
                  }
                />
                <Route
                  path={AppRoutes.OrderFlow}
                  element={
                    <PrivateRoute
                      redirectTo={AppRoutes.login}
                      component={<OrderFlow />}
                      role=""
                    />
                  }
                />
              </Routes>
            </div>
          </main>
          <NotificationContainer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App


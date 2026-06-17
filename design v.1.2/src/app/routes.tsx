import { createBrowserRouter } from "react-router";
import Root from "./Root";
import { HomePage } from "./pages/Home";
import { BrowsePage } from "./pages/Browse";
import { PopularPage } from "./pages/Popular";
import { GenresPage } from "./pages/Genres";
import { CompletedPage } from "./pages/Completed";
import { LatestUpdatesPage } from "./pages/LatestUpdates";
import { SignInPage } from "./pages/SignIn";
import { SearchPage } from "./pages/Search";
import { NovelDetailPage } from "./pages/NovelDetail";
import { ReaderPage } from "./pages/Reader";
import { DonationPage } from "./pages/Donation";
import { ProfilePage } from "./pages/Profile";
import { LibraryPage } from "./pages/Library";
import { HistoryPage } from "./pages/History";
import { SettingsPage } from "./pages/Settings";
import AdminRoot from "./pages/admin/AdminRoot";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { NovelManagement } from "./pages/admin/NovelManagement";
import { ChapterManagement } from "./pages/admin/ChapterManagement";
import { UserManagement } from "./pages/admin/UserManagement";
import { UploadCoverPage } from "./pages/admin/UploadCover";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "browse", Component: BrowsePage },
      { path: "popular", Component: PopularPage },
      { path: "genres", Component: GenresPage },
      { path: "completed", Component: CompletedPage },
      { path: "latest", Component: LatestUpdatesPage },
      { path: "signin", Component: SignInPage },
      { path: "search", Component: SearchPage },
      { path: "novel/:id", Component: NovelDetailPage },
      { path: "donation", Component: DonationPage },
      { path: "profile", Component: ProfilePage },
      { path: "library", Component: LibraryPage },
      { path: "history", Component: HistoryPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
  {
    path: "/read/:novelId/:chapterId",
    Component: ReaderPage,
  },
  {
    path: "/admin",
    Component: AdminRoot,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "novels", Component: NovelManagement },
      { path: "chapters", Component: ChapterManagement },
      { path: "users", Component: UserManagement },
      { path: "upload", Component: UploadCoverPage },
    ],
  },
]);

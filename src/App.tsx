import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminLogin from "./components/AdminLogin";
import AdminSign from "./components/AdminSign";
import Forum from "./components/Forum";
import Posts from "./components/Posts";
import Market from "./components/Market";
import Profile from "./components/Profile";
import CollectionDetail from "./components/CollectionDetail";
import AdminRevokePage from "./components/AdminRevokePage";
import CreateCollection from "./components/CreateCollection";
import DropCollectionPage from "./components/DropCollectionPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { AuthContextProvider } from "./components/authContext";
import { AdminContextProvider } from "./components/adminContext";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <AdminContextProvider>
          <Router>
            <div>
              <NavBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="profile" element={<Profile />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/market" element={<Market />} />
                <Route path="/create" element={<CreateCollection />} />
                <Route path="/drop" element={<DropCollectionPage />} />
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="adminsign" element={<AdminSign />} />
                <Route path="adminrevokepage" element={<AdminRevokePage />} />
                <Route path="/collections/:id" element={<CollectionDetail />} />
              </Routes>
            </div>
          </Router>
        </AdminContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;

import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import CreatePostPage from "../pages/CreatePostPage"
import LoginPage from "../pages/LoginPage";
import PostDetail from "./PostDetail";
import AuthGuard from "../guard/AuthGuard";
import NotFound from "./NotFound";
import ExplorePostPage from "../pages/ExplorePostsPage";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/post-detail",
        element: <PostDetail />
    },
    {
        path: "/",
        element: <AuthGuard />, //For Navbar Common View in Pages
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/new-post",
                element: <CreatePostPage />
            },
            //used for post detail page
            {
                path: "/posts/:postId", //dynamic id
                element: <PostDetail />
            }, 
            {
                path: "/explore-page",
                element: <ExplorePostPage />
            },
        ],
    },   
    {
        path: "*",
        element:
        <NotFound />,
    },
]);
import React, { Suspense, lazy } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Footer, Header } from "../Components";
import Modal from "../Components/Ui/Modal";

const Login = lazy(() => import("../Pages/Login"));
const SignUp = lazy(() => import("../Pages/SignUp"));

function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if modal should be open
  const isLoginModal = location.pathname === "/login";
  const isSignUpModal = location.pathname === "/signup";

  // Close modal handler
  const handleCloseModal = () => {
    // Navigate back to home or previous page
    const previousPath = location.state?.from || "/";
    navigate(previousPath, { replace: true });
  };

  return (
    <div>
      <Header />
      <Outlet />
      
      {/* Authentication Modals */}
      <Suspense fallback={null}>
        {isLoginModal && (
          <Modal isOpen={true} onClose={handleCloseModal}>
            <Login />
          </Modal>
        )}
        
        {isSignUpModal && (
          <Modal isOpen={true} onClose={handleCloseModal}>
            <SignUp />
          </Modal>
        )}
      </Suspense>
      
      <Footer />
    </div>
  );
}

export default UserLayout;

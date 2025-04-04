import { FC } from "react";
import { useState } from "react";
import { PasswordModelInterface } from "../constants/constants";

const PasswordModal: FC<PasswordModelInterface> = ({
  setShowChangePasswordModal,
}) => {
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    // Check if new password matches current password
    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    // Enhanced password complexity validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters and include:\n" +
          "- At least one uppercase letter\n" +
          "- At least one lowercase letter\n" +
          "- At least one number\n" +
          "- At least one special character (@$!%*?&)"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to change password");
      }

      setPasswordSuccess("Password changed successfully!");
      setPasswordError("");

      // Clear fields after successful change
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Close modal after 3 seconds
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setPasswordSuccess("");
      }, 3000);
    } catch (error) {
      setPasswordError((error as Error).message);
      setPasswordSuccess("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100000]">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>

        {passwordError && (
          <div className="text-red-500 mb-4 text-sm text-center">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="text-green-500 mb-4 text-sm text-center">
            {passwordSuccess}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded-2xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded-2xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-2xl"
            />
          </div>

          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setShowChangePasswordModal(false)}
              className="px-4 py-2 bg-gray-300 rounded-2xl hover:bg-gray-400 transition-all hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              style={{
                backgroundImage: "url('/assets/fr.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
                background:
                  "linear-gradient(13deg, rgba(20, 50, 20, 1), rgba(36, 20, 15, 0.2))",
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-2xl text-sm hover:bg-blue-600 hover:cursor-pointer"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;

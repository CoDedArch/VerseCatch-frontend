import { useState } from "react";
import {
  ALL_PASSWORD_FIELDS_REQUIRED_PROMPT,
  DIFF_PASSWORD_PROMPT,
  NEW_PASSWORD_DIFF_PROMPT,
  NEW_PASSWORD_FAILED_PROMPT,
  NEW_PASSWORD_SUCCESS_PROMPT,
  WEAK_PASSWORD_PROMPT,
} from "../../constants/varConstants";
import { CHANGE_PASSWORD_URL } from "../../constants/urlConstants";

const PasswordModal= () => {
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(ALL_PASSWORD_FIELDS_REQUIRED_PROMPT);
      return;
    }

    // Check if new password matches current password
    if (currentPassword === newPassword) {
      setPasswordError(DIFF_PASSWORD_PROMPT);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(NEW_PASSWORD_DIFF_PROMPT);
      return;
    }

    // Enhanced password complexity validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(WEAK_PASSWORD_PROMPT);
      return;
    }

    try {
      const response = await fetch(CHANGE_PASSWORD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || NEW_PASSWORD_FAILED_PROMPT);
      }

      setPasswordSuccess(NEW_PASSWORD_SUCCESS_PROMPT);
      setPasswordError("");

      // Clear fields after successful change
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Close modal after 3 seconds
      setTimeout(() => {
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

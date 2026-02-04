import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = existingUsers.find((u) => u.email === userData.email);

      if (userExists) {
        return {
          success: false,
          message: "Email already registered. Please use a different email.",
        };
      }

      // Create new user object (in production, password should be hashed)
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
      };

      // Save user to localStorage
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      return {
        success: true,
        message: "Registration successful! Please login.",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "An error occurred during registration. Please try again.",
      };
    }
  };

  const login = async (email, password) => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (!user) {
        return {
          success: false,
          message: "Invalid email or password. Please try again.",
        };
      }

      // Create user object without password for security
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

      // Store user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      return {
        success: true,
        message: "Login successful!",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "An error occurred during login. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = async (updatedData) => {
    try {
      if (!user) {
        return {
          success: false,
          message: "No user logged in.",
        };
      }

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u) => u.id === user.id);

      if (userIndex === -1) {
        return {
          success: false,
          message: "User not found.",
        };
      }

      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        name:
          updatedData.name !== undefined
            ? updatedData.name
            : users[userIndex].name,
        email:
          updatedData.email !== undefined
            ? updatedData.email
            : users[userIndex].email,
        password:
          updatedData.password !== undefined
            ? updatedData.password
            : users[userIndex].password,
      };

      localStorage.setItem("users", JSON.stringify(users));

      const updatedUser = {
        id: user.id,
        name: updatedData.name !== undefined ? updatedData.name : user.name,
        email: updatedData.email !== undefined ? updatedData.email : user.email,
        createdAt: user.createdAt,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return {
        success: true,
        message: "Account updated successfully!",
      };
    } catch (error) {
      console.error("Update error:", error);
      return {
        success: false,
        message:
          "An error occurred while updating your account. Please try again.",
      };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

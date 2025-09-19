import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./rej.css"; // ensure this file exists next to this file
 
function Registration() {
  const navigate = useNavigate();
 
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    age: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
 
  const [errors, setErrors] = useState({});
 
  const nameRegex = /^[A-Za-z]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
 
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
 
  const validateBeforeSubmit = () => {
    const newErrors = {};
    const fname = (form.fname || "").trim();
    const lname = (form.lname || "").trim();
    const email = (form.email || "").trim();
    const address = (form.address || "").trim();
 
    if (!fname || !nameRegex.test(fname)) newErrors.fname = "Enter a valid first name (letters only).";
    if (!lname || !nameRegex.test(lname)) newErrors.lname = "Enter a valid last name (letters only).";
    if (!email || !emailRegex.test(email)) newErrors.email = "Enter a valid email address.";
    if (!address) newErrors.address = "Address cannot be empty.";
    if (!passRegex.test(form.password))
      newErrors.password =
        "Password must be at least 8 chars, include uppercase, lowercase, a digit and a special char.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateBeforeSubmit();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
 
    // Save (without confirmPassword)
    const toSave = {
      fname: form.fname.trim(),
      lname: form.lname.trim(),
      age: form.age || "",
      email: form.email.trim(),
      address: form.address.trim(),
      password: form.password,
    };
 
    try {
      localStorage.setItem("userData", JSON.stringify(toSave));
    } catch (err) {
      console.error("Failed to save user data:", err);
      setErrors({ general: "An error occurred saving your data. Try again." });
      return;
    }
 
    alert("Registration successful ✅ — redirecting to login");
    navigate("/login");
  };
 
  const handleReset = () => {
    setForm({
      fname: "",
      lname: "",
      age: "",
      email: "",
      address: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };
 
  return (
    <div className="reg-page-wrap">
      <div className="reg-container" role="main" aria-labelledby="reg-title">
       
        {errors.general && <div className="form-error">{errors.general}</div>}
 
        <h1 id="reg-title" className="form-title">Registration Form</h1>
 
        <form id="userForm" onSubmit={handleSubmit} onReset={handleReset} noValidate>
          <div className="form-row">
            <label htmlFor="fname" className="required">First Name</label>
            <input id="fname" name="fname" value={form.fname} onChange={onChange} autoComplete="given-name" />
            {errors.fname && <p className="error">{errors.fname}</p>}
          </div>
 
          <div className="form-row">
            <label htmlFor="lname" className="required">Last Name</label>
            <input id="lname" name="lname" value={form.lname} onChange={onChange} autoComplete="family-name" />
            {errors.lname && <p className="error">{errors.lname}</p>}
          </div>
 
 
          <div className="form-row">
            <label htmlFor="age">Age</label>
            <input id="age" name="age" type="number" min="0" value={form.age} onChange={onChange} />
          </div>
 
          <div className="form-row">
            <label htmlFor="email" className="required">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={onChange} autoComplete="email" />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
 
          <div className="form-row">
            <label htmlFor="address" className="required">Address</label>
            <textarea id="address" name="address" rows="3" value={form.address} onChange={onChange} />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>
 
          <div className="form-row">
            <label htmlFor="password" className="required">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={onChange} autoComplete="new-password" />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
 
          <div className="form-row">
            <label htmlFor="confirmPassword" className="required">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} autoComplete="new-password" />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>
 
          <div className="buttons">
            <button type="reset" className="btn btn-reset">Reset</button>
            <button type="submit" className="btn btn-submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
 
export default Registration;
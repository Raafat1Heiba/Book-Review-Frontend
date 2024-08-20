import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../api/axios";
import { EMAIL_REGEX } from "../../components/regex/email";
import { PASSWORD_REGEX } from "../../components/regex/pass";
import { USER_REGEX } from "../../components/regex/user";
import { useNavigate } from "react-router-dom";

interface FormValues {
  fullName: string;
  email: string;
  password: string;
  general?: string;
}

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik<FormValues>({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .required("Required")
        .matches(USER_REGEX, "Invalid username")
        .min(2, "Too Short!")
        .max(50, "Too Long!"),
      email: Yup.string()
        .matches(EMAIL_REGEX, "Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .matches(
          PASSWORD_REGEX,
          "Password must be at least 6 characters and contain at least one letter and one number"
        )
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post("/authentication/register", {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        });
        console.log("Registration successful:", response.data);
        navigate("/login");
      } catch (err: any) {
        if (err.response) {
          setErrors({
            general:
              err.response.data.message ||
              "Registration failed. Please try again.",
          });
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        }}
      >
        <h3 className="text-center mb-4">Sign Up</h3>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              User Name
            </label>
            <input
              type="text"
              className={`form-control ${
                formik.touched.fullName && formik.errors.fullName
                  ? "is-invalid"
                  : ""
              }`}
              id="username"
              {...formik.getFieldProps("fullName")}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            />
            {formik.touched.fullName && formik.errors.fullName ? (
              <div className="invalid-feedback">{formik.errors.fullName}</div>
            ) : null}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              id="email"
              {...formik.getFieldProps("email")}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="invalid-feedback">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className={`form-control ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
              }`}
              id="password"
              {...formik.getFieldProps("password")}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="invalid-feedback">{formik.errors.password}</div>
            ) : null}
          </div>

          {formik.errors.general && (
            <div className="alert alert-danger">{formik.errors.general}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

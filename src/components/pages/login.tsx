import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../components/hooks/useAuth";

interface FormValues {
  email: string;
  password: string;
  general?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { setAuth }: any = useAuth();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post("/authentication/login", values);
        const token = response.data.token;
        const userId = response.data.userId;

        console.log("Login successful:", response.data);

        setAuth({ token, userId });
        localStorage.setItem("token", token);

        navigate("/");
      } catch (err: any) {
        if (err.response) {
          setErrors({
            general:
              err.response.data.message || "Incorrect email or password.",
          });
        } else {
          setErrors({
            general: "An unexpected error occurred. Please try again.",
          });
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
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={formik.handleSubmit}>
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
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { redirect } from "react-router-dom";

function Login() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!code) {
      Swal.fire("แจ้งเตือน!", "กรุณากรอกรหัสพนักงาน!", "warning");
    } else if (!password) {
      Swal.fire("แจ้งเตือน!", "กรุณากรอกรหัสผ่าน", "warning");
    } else {
      setLoading(true);
      axios
        .post("https://stock.akhoocafe.cloud/manage/api/login.php", {
          code: code,
          password: password,
        })
        .then((response) => response.data)
        .then((responseJson) => {
          setLoading(false);
          if (responseJson.result === "success") {
            sessionStorage.setItem("uid", responseJson.user.id);
            Swal.fire({
              title: "เข้าสู่ระบบสำเร็จ",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              // กำหนด URL ที่ต้องการ redirect ไป
              window.location.href = "/";
            });
          } else {
            Swal.fire("แจ้งเตือน!", responseJson.result, "warning");
          }
        })
        .catch((error) => {
          setLoading(false);
          Swal.fire("แจ้งเตือน!", "ไม่สามารถเชื่อมต่อได้", "warning");
        });
    }
  };
  console.log(code);
  return (
    <div className="wrapper">
      <div className="">
        <div className="row g-0 m-0">
          <div className="col-xl-6 col-lg-12 mx-auto">
            <div className="login-cover-wrapper">
              <div className="card shadow-none">
                <div className="card-body">
                  <div className="text-center">
                    <h3 className="titles mb-3">เข้าสู่ระบบ เบิกสินค้า </h3>
                    <h4 className="titles"></h4>
                  </div>
                  <form
                    method="post"
                    onSubmit={handleSubmit}
                    className="form-body row g-3"
                  >
                    <div className="col-12">
                      <label htmlFor="inputEmail" className="form-label titles">
                        รหัสพนักงาน
                      </label>
                      <input
                        type="text"
                        name="code"
                        className="form-control"
                        id="inputEmail"
                        onChange={(txt) => setCode(txt.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor="inputPassword"
                        className="form-label titles"
                      >
                        รหัสผ่าน
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        id="inputPassword"
                        onChange={(txt) => setPassword(txt.target.value)}
                      />
                    </div>

                    <div className="col-12 col-lg-12">
                      <div className="d-grid">
                        {loading ? (
                          <button
                            type="submit"
                            name="btn_login"
                            className="btn btn-primary titles"
                            disabled
                          >
                            <i className="fas fa-spinner fa-spin"></i> กำลังโหลด
                          </button>
                        ) : (
                          <button
                            type="submit"
                            name="btn_login"
                            className="btn btn-primary titles"
                          >
                            <i className="fas fa-sign-in-alt"></i> เข้าสู่ระบบ
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

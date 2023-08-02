import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { redirect } from "react-router-dom";
import Login from "./Login";

function Pickup() {
  const [code, setCode] = useState("");
  const [product, setProducts] = useState();
  const [cart, setCart] = useState();
  const [category, setCategory] = useState();
  const [staff, setStaff] = useState();
  const [uid, setUid] = useState();
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [loading0, setLoading0] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);

  console.log(selectedCategory);

  const handleLogout = () => {
   setLoading0(true);
    sessionStorage.removeItem("uid");
    setLoading0(false);
    window.location.href = "/";
    setUid();
  };

  const handleSearch = async (keyword) => {
    setSearchKeyword(keyword);
    const filteredProducts = product.filter((product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setSearchResults(filteredProducts);
  };

  // ฟังก์ชันเมื่อเลือกหมวดหมู่
  const handleSelectCategory = async (event) => {
    const categoryId = parseInt(event.target.value);
    setSelectedCategory(categoryId);

    await axios
      .post("https://stock.akhoocafe.cloud/manage/api/categorys.php", {
        cid: categoryId,
      })
      .then((response) => response.data)
      .then((responseJson) => {
        console.log(responseJson);
        setProducts(responseJson);
        handleSearch(searchKeyword);
      })
      .catch((error) => {
        Swal.fire("แจ้งเตือน!", "ไม่สามารถเชื่อมต่อได้", "warning");
      });
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        "https://stock.akhoocafe.cloud/manage/api/cart.php"
      );
      setCart(response.data);
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "https://stock.akhoocafe.cloud/manage/api/category.php"
      );
      setCategory(response.data);
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const uid = await sessionStorage.getItem("uid");
      axios
        .post("https://stock.akhoocafe.cloud/manage/api/staff.php", {
          code: uid,
        })
        .then((response) => response.data)
        .then((responseJson) => {
          setStaff(responseJson.user);
        })
        .catch((error) => {
          console.log("เกิดข้อผิดพลาด:", error);
        });
    } catch (error) {
      console.log("เกิดข้อผิดพลาด:", error);
    }
  };

  useEffect(() => {
    // สร้างฟังก์ชันที่ใช้ในการดึงข้อมูลสินค้าจาก API
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://stock.akhoocafe.cloud/manage/api/product.php"
        );
        setProducts(response.data);
      } catch (error) {
        console.log("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", error);
      }
    };
    const uid = sessionStorage.getItem("uid");
    if (uid) {
        setUid(uid);
    }
    // เรียกใช้ฟังก์ชันดึงข้อมูลสินค้า
    fetchProducts();
    fetchCart();
    fetchCategory();
    fetchStaff();
  }, []);

  const addToCart = (productId, quantity) => {
    setLoading(true);
    axios
      .post("https://stock.akhoocafe.cloud/manage/api/add_cart.php", {
        pid: productId,
        item: quantity,
      })
      .then((response) => response.data)
      .then((responseJson) => {
        setLoading(false);
        if (responseJson === "success") {
          console.log(responseJson);
          fetchCart();
        } else {
          console.log(responseJson);
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire("แจ้งเตือน!", "ไม่สามารถเชื่อมต่อได้", "warning");
      });
  };

  const UpdateCart = (productId, types) => {
    setLoading1(true);
    axios
      .post("https://stock.akhoocafe.cloud/manage/api/update_cart.php", {
        pid: productId,
        types: types,
      })
      .then((response) => response.data)
      .then((responseJson) => {
        setLoading1(false);
        if (responseJson === "success") {
          console.log(responseJson);
          fetchCart();
        } else {
          console.log(responseJson);
        }
      })
      .catch((error) => {
        setLoading1(false);
        Swal.fire("แจ้งเตือน!", "ไม่สามารถเชื่อมต่อได้", "warning");
      });
  };

  const addPickup = async () => {
    const uid = await sessionStorage.getItem("uid");

    Swal.fire({
      title: "ยืนยันการเบิกสินค้า?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่! ลบเลย",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        axios
          .post("https://stock.akhoocafe.cloud/manage/api/add_pickup.php", {
            uid: uid,
          })
          .then((response) => response.data)
          .then((responseJson) => {
            setLoading(false);
            if (responseJson === "success") {
              Swal.fire("สำเร็จ", "บันทึกการเบิกสินค้าสำเร็จ", "success");
              fetchCart();
            } else {
              console.log(responseJson);
            }
          })
          .catch((error) => {
            setLoading(false);
            Swal.fire("แจ้งเตือน!", "ไม่สามารถเชื่อมต่อได้", "warning");
          });
      }
    });
  };

  console.log(searchResults);
  console.log(product);
  //console.log(sessionStorage.getItem("uid"));

  return uid? (
    <div className="p-5">
      <div className="page-content-wrapper">
        <div className="page-content">
          <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
            <div className="breadcrumb-title pe-3">เบิกสินค้า</div>
            <div className="ps-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0 align-items-center">
                  <i className="fas fa-chevron-right "></i> &emsp;
                  <li className="breadcrumb-item active" aria-current="page">
                    เบิกสินค้า
                  </li>
                </ol>
              </nav>
            </div>
            <div className="ms-auto">
              <button type="button" onClick={()=>handleLogout()} disabled={loading0} className="btn btn-success">
              <i className="fas fa-sign-out-alt"></i> ออกจากระบบ
              </button>
            </div>
          </div>
          <section className="shop-page">
            <div className="shop-container">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-xl-12">
                      <div className="product-wrapper">
                        <div className="card">
                          <div className="card-body">
                            <div className="position-relative">
                              <div className="input-group mb-3">
                                <label
                                  className="input-group-text"
                                  htmlFor="inputGroupSelect03"
                                >
                                  หมวดหมู่
                                </label>
                                <select
                                  className="form-select"
                                  id="inputGroupSelect03"
                                  aria-label="Example select with button addon"
                                  value={selectedCategory}
                                  onChange={handleSelectCategory}
                                >
                                  <option value={0} selected>
                                    ทั้งหมด
                                  </option>
                                  {category
                                    ? category.map((c) => (
                                        <option key={c.cid} value={c.cid}>
                                          {c.category}
                                        </option>
                                      ))
                                    : null}
                                </select>
                                <input
                                  type="text"
                                  name="productName"
                                  id="search-input"
                                  value={searchKeyword}
                                  className="form-control ps-3"
                                  placeholder="พิมพ์คำค้นหา..."
                                  onChange={(e) => handleSearch(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-9">
                            <div className="product-grid">
                              {searchKeyword ? (
                                <div
                                  className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4"
                                  id="products-container"
                                >
                                  {searchKeyword
                                    ? searchResults.map((product) => (
                                        <div key={product.id} className="col">
                                          <div className="card product-card">
                                            <div className="card-header bg-transparent border-bottom-0">
                                              <div className="d-flex align-items-center justify-content-end"></div>
                                            </div>
                                            <div
                                              style={{ textAlign: "center" }}
                                            >
                                              <img
                                                src={product.img_url}
                                                style={{
                                                  width: 100,
                                                  height: 100,
                                                }}
                                                className="card-img-top"
                                                alt="..."
                                              />
                                            </div>
                                            <div className="card-body">
                                              <div className="product-info">
                                                <h6 className="product-name mb-2">
                                                  {product.name}
                                                </h6>
                                                <div className="d-flex align-items-center">
                                                  <div className="product-price">
                                                    <span
                                                      style={{
                                                        fontSize: 16,
                                                        color: "blue",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      ฿ {product.price}
                                                    </span>
                                                  </div>
                                                </div>
                                                <div style={{display:'flex',justifyContent:'space-between'}}>
                                                <span
                                                  style={{ fontWeight: "bold" }}
                                                >
                                                  {product.code}
                                                </span>
                                                <span
                                                  style={{ fontWeight: "bold" }}
                                                >
                                                  {product.code}
                                                </span>
                                                </div>
                                                
                                                <div className=" mt-2">
                                                  <div className="row">
                                                    <div className="col-6">
                                                      <input
                                                        className=" form-control "
                                                        min="1"
                                                        id={`quantity_${product.id}`}
                                                        type="number"
                                                        defaultValue="1"
                                                      />
                                                    </div>
                                                    <div className="col-6">
                                                      <button
                                                        className="btn btn-primary "
                                                        onClick={() =>
                                                          addToCart(
                                                            product.id,
                                                            parseInt(
                                                              document.getElementById(
                                                                `quantity_${product.id}`
                                                              ).value
                                                            )
                                                          )
                                                        }
                                                        disabled={loading}
                                                      >
                                                        <i className="fas fa-plus"></i>
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    : null}
                                </div>
                              ) : (
                                <div
                                  className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4"
                                  id="products-container"
                                >
                                  {product
                                    ? product.map((product) => (
                                        <div key={product.id} className="col">
                                          <div className="card product-card">
                                            <div className="card-header bg-transparent border-bottom-0">
                                              <div className="d-flex align-items-center justify-content-end"></div>
                                            </div>
                                            <div
                                              style={{ textAlign: "center" }}
                                            >
                                              <img
                                                src={product.img_url}
                                                style={{
                                                  width: 100,
                                                  height: 100,
                                                }}
                                                className="card-img-top"
                                                alt="..."
                                              />
                                            </div>
                                            <div className="card-body">
                                              <div className="product-info">
                                                <h6 className="product-name mb-2">
                                                  {product.name}
                                                </h6>
                                                <div className="d-flex align-items-center">
                                                  <div className="product-price">
                                                    <span
                                                      style={{
                                                        fontSize: 16,
                                                        color: "blue",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      ฿ {product.price}
                                                    </span>
                                                  </div>
                                                </div>
                                                <h6
                                                  style={{ fontWeight: "bold" }}
                                                >
                                                  {product.code}
                                                </h6>
                                                <div className=" mt-2">
                                                  <div className="row">
                                                    <div className="col-6">
                                                      <input
                                                        className=" form-control "
                                                        min="1"
                                                        id={`quantity_${product.id}`}
                                                        type="number"
                                                        defaultValue="1"
                                                      />
                                                    </div>
                                                    <div className="col-6">
                                                      <button
                                                        className="btn btn-primary "
                                                        onClick={() =>
                                                          addToCart(
                                                            product.id,
                                                            parseInt(
                                                              document.getElementById(
                                                                `quantity_${product.id}`
                                                              ).value
                                                            )
                                                          )
                                                        }
                                                        disabled={loading}
                                                      >
                                                        <i className="fas fa-plus"></i>
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    : null}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-3">
                            <h5>รายการ</h5>
                            <hr />
                            <div id="cart-response">
                              <table className=" table table-striped">
                                <tbody>
                                  {cart
                                    ? cart.map((c) => (
                                        <tr key={c.id}>
                                          <td
                                            style={{ width: "70%" }}
                                            className=" align-middle"
                                          >
                                            <h6>{c.name}</h6>
                                          </td>
                                          <td className=" align-middle titles text-nowrap">
                                            <div style={{ padding: 5 }}>
                                              <span
                                                onClick={() =>
                                                  UpdateCart(c.idp, "minus")
                                                }
                                                style={{
                                                  backgroundColor: "#ddd",
                                                  padding: 5,
                                                  paddingLeft: 10,
                                                  paddingRight: 10,
                                                  borderRadius: "100%",
                                                  cursor: "pointer",
                                                  pointerEvents: loading1
                                                    ? "none"
                                                    : "auto", // ตั้งค่า pointerEvents เพื่อ disable ปุ่มเมื่อ quantity เป็น 1
                                                  opacity: loading1 ? 0.5 : 1,
                                                }}
                                              >
                                                <i className="fas fa-minus "></i>
                                              </span>
                                              <span style={{ fontSize: 18 }}>
                                                &nbsp;&nbsp;{c.item}&nbsp;&nbsp;
                                              </span>
                                              <span
                                                onClick={() =>
                                                  UpdateCart(c.idp, "plus")
                                                }
                                                style={{
                                                  backgroundColor: "#ddd",
                                                  padding: 5,
                                                  paddingLeft: 10,
                                                  paddingRight: 10,
                                                  borderRadius: "50%",
                                                  cursor: "pointer",
                                                  pointerEvents: loading1
                                                    ? "none"
                                                    : "auto", // ตั้งค่า pointerEvents เพื่อ disable ปุ่มเมื่อ quantity เป็น 1
                                                  opacity: loading1 ? 0.5 : 1,
                                                }}
                                              >
                                                <i className="fas fa-plus "></i>
                                              </span>
                                            </div>
                                          </td>
                                        </tr>
                                      ))
                                    : null}
                                </tbody>
                              </table>
                              <h6>
                                <span style={{ fontWeight: "bold" }}>
                                  พนักงานเบิก:
                                </span>{" "}
                                {staff?.name} {staff?.last}{" "}
                                {staff?.nickname
                                  ? +"(" + staff.nickname + ")"
                                  : null}
                              </h6>

                              <div className="row">
                                <div className="col-12 "></div>
                                <div
                                  className="col-12 mt-3"
                                  style={{
                                    paddingTop: 5,
                                    textAlign: "center",
                                  }}
                                >
                                  {cart ? (
                                    loadings ? (
                                      <button
                                        type="submit"
                                        name="btn_login"
                                        className="btn btn-primary titles"
                                        disabled
                                      >
                                        <i className="fas fa-spinner fa-spin"></i>{" "}
                                        กำลังบันทึก
                                      </button>
                                    ) : (
                                      <button
                                        onClick={addPickup}
                                        className="btn btn-success"
                                      >
                                        ยืนยันการเบิก
                                      </button>
                                    )
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <a href="javaScript:;" className="back-to-top">
        <ion-icon name="arrow-up-outline"></ion-icon>
      </a>
      <div className="overlay"></div>
    </div>
  ):<Login/>;
}

export default Pickup;

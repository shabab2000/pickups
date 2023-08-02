import React,{useState} from "react";

function Home() {

  const [uid,setUid] = useState();
  // การดึงค่าที่เก็บใน sessionStorage ด้วยชื่อ key "uid"
  const uidValue = sessionStorage.getItem("uid");

  useEffect(() => {
    const uid = sessionStorage.getItem("uid");
    if (uid) {
        setUid(uid);
    }
  }, []);

  // ตัวอย่างการใช้ค่าที่เก็บใน sessionStorage
  console.log("ค่า uid ที่เก็บใน sessionStorage:", uidValue);

  return (
    <div>
      <p>5555555555555555555555555555555555555555555555555555555555555</p>
    </div>
  );
}
export default Home;

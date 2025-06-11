// import React, { useState } from "react";
import Logout from "./auth/Logout";
// import axios from "axios";

// const Home = () => {
//   const [file, setFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState(null);

//   const upload = () => {
//     if (!file) return alert("اختر ملفًا أولاً!");

//     const formData = new FormData();
//     formData.append("file", file);

//     axios
//       .post("http://localhost:3000/upload", formData)
//       .then((res) => {
//         console.log("تم الرفع:", res.data);

//         const filename = res.data.file.filename;
//         const fullUrl = `http://localhost:3000/upload/${filename}`;

//         setImageUrl(fullUrl);
//       })
//       .catch((err) => {
//         console.error("خطأ في الرفع:", err);
//       });
//   };

//   return (
//     <div>
//       {" "}
//       <Logout />
//       <div>
//         <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//         <button onClick={upload}>رفع الملف</button>

//         {imageUrl && (
//           <div>
//             <h3>الصورة المرفوعة:</h3>
//             <img src={imageUrl} alt="Uploaded" width="300" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;
import React from "react";

const Home = () => {
  return (
    <div>
      <Logout />
    </div>
  );
};

export default Home;

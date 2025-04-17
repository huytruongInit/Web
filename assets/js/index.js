// IMPORT
import { 
    ref, 
    set, 
    get,
    onValue,
    remove,
    query,
    equalTo,
    orderByChild
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

import { database, auth } from '../config/firebase.config.js';

import { 
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";


import Swal from 'sweetalert2'

console.log(Swal);
// Biến lưu trữ userId
let userId = null;    
let PATH_TEMPLATE_ID = "";

// KIỂM TRA XEM USER ĐÃ ĐĂNG NHẬP CHƯA
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        userId = user.uid;
    }
    else {
      // User is signed out
      window.location.href = "sign-in.html"
    }
});
// HẾT KIỂM TRA XEM USER ĐÃ ĐĂNG NHẬP CHƯA

// THÊM NGƯỜI DÙNG (NHẤN NÚT ĐỂ BẮT ĐẦU ĐĂNG KÝ)
const btnAddUser = document.querySelector(".btn-add-user");
if(btnAddUser) {
    btnAddUser.addEventListener("click", async (evnet) => {
        /**
         *  struture data thông báo tín hiệu đăng ký
            register: {
                status: "finger",   // đăng ký finger
                uid: 1 -> 127
            }
        */
        
        // path truy cập đến nextFingerID
        const PATH_NEXT_ID  = "Store/"  + userId + "/" + "nextFingerID";

        // path truy cập đến tín hiệu THÊM NGƯỜI DÙNG MỚI
        const PATH_REGISTER = "Store/"  + userId + "/" + "register";

        // lấy nextFingerID trên firebase
        const nextFingerIDRaw =  await get(ref(database, PATH_NEXT_ID));
        const nextFingerID    =  await nextFingerIDRaw.val(); 

        // update giá trị nextId cho lần sau
        set(ref(database, PATH_NEXT_ID), nextFingerID + 1);
        
        // set tín hiệu tạo người dùng mới
        const data = { status: true, uid: nextFingerID };
        set(ref(database, PATH_REGISTER), data);

        // chuyển hướng sang trang thêm người dùng mới
        window.location.href = "add.html";
    });
}
// HẾT THÊM NGƯỜI DÙNG

// THÊM NGƯỜI DÙNG MỚI (NHẤN NÚT ĐỂ HOÀN TẤT ĐĂNG KÝ)
const formRegister = document.querySelector("[form-register]");
if(formRegister) {
    formRegister.addEventListener("submit", async (event) => {
        event.preventDefault();

        // thông tin đăng ký (tên, số điện thoại, số phòng)
        const fullName = event.target.fullName.value;
        const tel      = event.target.tel.value;
        const roomId   = event.target.roomId.value;

        // lấy vân tay
        const PATH_REGISTER_FINGER_ID = `Store/${userId}/template/fingerID`;
        const snapshotFinger = await get(ref(database, PATH_REGISTER_FINGER_ID));
        const fingerID = await snapshotFinger.val(); 


        // Nếu thiếu thì alert (LÀM SAU);
        
        // Lấy timestamp hiện tại làm ID cho người mới
        // ID cho người mới (người vào ở)
        const customerID =   `CUS${Date.now()}`;

        // Đường dẫn lưu trữ thông tin người dùng
        const PATH_REGISTER_FINAL = `Home/${userId}/${customerID}`;

        const data = { 
            fullName,
            tel,
            roomId,
            fingerID
        };
        set(ref(database, PATH_REGISTER_FINAL), data);

        // xóa tín hiệu đăng ký và template
        remove(ref(database, `Store/${userId}/template`));
        remove(ref(database, `Store/${userId}/register`));

        await Swal.fire({
            // position: "",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 2000
        });

        // Chuyển hướng về trang tổng quan
        window.location.href = "index.html";
    });

    
}
// HẾT THÊM NGƯỜI DÙNG MỚI


setTimeout(() => {
    // Path
    const PATH_TEMPLATE_ID = `Store/${userId}/template/fingerID`;

    // UPDATE VÂN TAY LÊN GIAO DIỆN ĐĂNG KÝ
    onValue(ref(database, PATH_TEMPLATE_ID), (snapshot) => {
        const data = snapshot.val();

        if(data !== null) {
            const fingerID = document.querySelector("[fingerID]");
            if(fingerID) {
                const fingerImage = fingerID.querySelector("img");
                const fingerInput = fingerID.querySelector("input[name='fingerID']");
                
                fingerInput.value = data;
                fingerImage.src = 'https://media.wired.com/photos/5bef60888cd3bb7c5ea63882/1:1/w_1459,h_1459,c_limit/Fingerprints-182668331.jpg';
            }
        }
    });
    // HẾT UPDATE VÂN TAY LÊN GIAO DIỆN ĐĂNG KÝ

    // LẤY THÔNG TIN MỞ CỬA LƯU VÀO HISTORY
    // Cái isOpen này sẽ chứa những thông tin fingerID hoặc RFID đã mở cửa mà chưa xử lý
    const PATH_STORE_IS_OPEN = `Store/${userId}/isOpen`;

    onValue(ref(database, PATH_STORE_IS_OPEN), async (snapIsOpened) => {
        // Nếu có dữ liệu mở cửa chưa được xử lý
        if(snapIsOpened.exists()) {
            snapIsOpened.forEach((itemOpened, index) => {
                // Lấy key
                // Key thì mình sẽ tách vì nó có định dạng: fingerID${ID của vân tay}
                // Ví dụ: fingerID1
                const key = itemOpened.key;

                // Lấy value của key đó
                const data = itemOpened.val();

                // tách
                const arr = key.split('-');

                onValue(ref(database, `/Home/${userId}`), (snapHome) => {
                    snapHome.forEach((itemHome, index) => {
                        
                        // lấy ID của người ở trọ
                        const cusID = itemHome.key;

                        // lấy data của người ở trọ
                        const cusData = itemHome.val();
                        
                        if(cusData[arr[0]] == arr[1]) {
                            // giả lập thời gian
                            const timestamp = Date.now();

                            // Path lưu trữ
                            const PATH_HISTORY = `History/${userId}/${cusID}/${timestamp}`;

                            // sẽ lưu mở của lúc mấy giờ, arr[0] chỉ ra fingerID hay RFID biểu thị mở cửa bằng cái gì
                            set(ref(database, PATH_HISTORY), arr[0]); 

                            // Lưu trữ dữ liệu xong thì xóa khỏi bản raw
                            remove(ref(database, PATH_STORE_IS_OPEN + "/" + key));

                        }
                    });
                });
            });
        }
    });
        
    // });
    // HẾT LẤY THÔNG TIN MỞ CỬA LƯU VÀO HISTORY
}, 1000);






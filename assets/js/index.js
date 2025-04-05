// IMPORT
import { ref, set, get } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import database from '../config/firebase.config.js';

const refRegister = ref(database, 'register');

// THÊM NGƯỜI DÙNG (NHẤN NÚT ĐỂ BẮT ĐẦU ĐĂNG KÝ)
const btnAddUser = document.querySelector(".btn-add-user");
if(btnAddUser) {
    btnAddUser.addEventListener("click", (evnet) => {
        /**
         *  struture data thông báo tín hiệu đăng ký
            register: {
                status: true,
                uid: 1 -> 127
            }
        */
        const data = { status: true, uid: 100 };
        set(refRegister, data);

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
        /**
         *  struture data thông tin đăng ký
            {
                uid: 1 -> 127
                fullName: "Giang Truong",
                tel: 0347921677,
                roomId: "C9",
                finger: "abhsđnaksjkkbhb",
                rfid: "adbashdabjsdabh"
            }
        */

        // thông tin đăng ký (tên, số điện thoại, số phòng)
        const fullName = event.target.fullName.value;
        const tel      = event.target.tel.value;
        const roomId   = event.target.roomId.value;

        // lấy vân tay
        const snapshotFinger = await get(ref(database, 'fingerTemplate'));
        const finger = await snapshotFinger.val(); 

        // lấy rfid
        const snapshotRfid = await get(ref(database, 'rfidTemplate'));
        const rfid = await snapshotRfid.val(); 

        // kiểm tra nếu thiếu thì alert 

    });
}
// THÊM NGƯỜI DÙNG MỚI
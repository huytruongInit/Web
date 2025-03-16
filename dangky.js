document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    
    if (name && email && password) {
        alert('Đăng ký thành công!');
    } else {
        alert('Vui lòng nhập đầy đủ thông tin!');
    }
});
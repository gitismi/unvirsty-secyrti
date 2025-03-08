
// وظائف نظام الطلاب

function login() {
    // في الإنتاج، يجب تنفيذ نظام تسجيل دخول حقيقي هنا
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('services').classList.remove('hidden');
}

function showStudentData() {
    document.getElementById('forms').classList.remove('hidden');
    document.getElementById('studentDataForm').classList.remove('hidden');
}

function fetchBySocial() {
    alert('هذه الميزة قيد التطوير');
}

function showAllResults() {
    alert('هذه الميزة قيد التطوير');
}

function fetchStudentData() {
    const enrollmentNumber = document.getElementById('enrollmentNumber').value;
    if (!enrollmentNumber) {
        alert('الرجاء إدخال رقم القيد');
        return;
    }
    
    // هنا يمكن تنفيذ طلب API للحصول على بيانات الطالب
    alert(`جاري البحث عن الطالب برقم القيد: ${enrollmentNumber}`);
    
    // في الإنتاج، يجب استخدام fetch للحصول على البيانات من الخادم
    // مثال:
    // fetch(`/api/students/${enrollmentNumber}`)
    //   .then(response => response.json())
    //   .then(data => {
    //     // عرض بيانات الطالب
    //   })
    //   .catch(error => {
    //     alert('حدث خطأ في البحث عن بيانات الطالب');
    //   });
}

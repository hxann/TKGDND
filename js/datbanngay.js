// Xử lý chuyển đổi category tabs
document.addEventListener('DOMContentLoaded', function() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const menuCategories = document.querySelectorAll('.menu-category');

    // Debug: Kiểm tra xem có tìm thấy elements không
    console.log('Category tabs found:', categoryTabs.length);
    console.log('Menu categories found:', menuCategories.length);

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            
            console.log('Clicked category:', category);
            
            // Remove active class from all tabs and categories
            categoryTabs.forEach(t => t.classList.remove('active'));
            menuCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding category
            this.classList.add('active');
            const targetCategory = document.querySelector(`.menu-category[data-category="${category}"]`);
            
            if (targetCategory) {
                targetCategory.classList.add('active');
                console.log('Activated category:', category);
            } else {
                console.log('Target category not found:', category);
            }
        });
    });

    // Xử lý quantity controls
    const qtyBtns = document.querySelectorAll('.qty-btn');
    qtyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const quantitySpan = this.parentNode.querySelector('.quantity');
            const menuItemCard = this.closest('.menu-item-card');
            const checkbox = menuItemCard.querySelector('input[type="checkbox"]');
            let quantity = parseInt(quantitySpan.textContent);
            
            if (this.classList.contains('plus')) {
                quantity++;
                checkbox.checked = true;
            } else if (this.classList.contains('minus') && quantity > 0) {
                quantity--;
                if (quantity === 0) {
                    checkbox.checked = false;
                }
            }
            
            quantitySpan.textContent = quantity;
            updateTotalAmount();
        });
    });

    // Xử lý checkbox change
    const checkboxes = document.querySelectorAll('input[name="dishes"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const menuItemCard = this.closest('.menu-item-card');
            const quantitySpan = menuItemCard.querySelector('.quantity');
            
            if (!this.checked) {
                quantitySpan.textContent = '0';
            } else if (quantitySpan.textContent === '0') {
                quantitySpan.textContent = '1';
            }
            updateTotalAmount();
        });
    });

    // Cập nhật tổng tiền
    function updateTotalAmount() {
        let total = 0;
        const checkedItems = document.querySelectorAll('input[name="dishes"]:checked');
        
        checkedItems.forEach(item => {
            const menuItemCard = item.closest('.menu-item-card');
            const priceText = menuItemCard.querySelector('.dish-price').textContent;
            const price = parseInt(priceText.replace(/[^\d]/g, ''));
            const quantity = parseInt(menuItemCard.querySelector('.quantity').textContent);
            total += price * quantity;
        });
        
        const totalAmountElement = document.getElementById('totalAmount');
        if (totalAmountElement) {
            totalAmountElement.textContent = total.toLocaleString('vi-VN') + 'đ';
        }
    }

    // Xử lý form submit
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate required fields
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    field.style.borderColor = '#ddd';
                }
            });
            
            if (!isValid) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
                return;
            }
            
            // Collect form data
            const formData = new FormData(this);
            const bookingData = {};
            
            for (let [key, value] of formData.entries()) {
                if (bookingData[key]) {
                    if (Array.isArray(bookingData[key])) {
                        bookingData[key].push(value);
                    } else {
                        bookingData[key] = [bookingData[key], value];
                    }
                } else {
                    bookingData[key] = value;
                }
            }
            
            // Add selected dishes with quantities
            const selectedDishes = [];
            const checkedItems = document.querySelectorAll('input[name="dishes"]:checked');
            checkedItems.forEach(item => {
                const menuItemCard = item.closest('.menu-item-card');
                const dishName = menuItemCard.querySelector('h4').textContent;
                const quantity = parseInt(menuItemCard.querySelector('.quantity').textContent);
                const price = menuItemCard.querySelector('.dish-price').textContent;
                
                selectedDishes.push({
                    name: dishName,
                    quantity: quantity,
                    price: price
                });
            });
            
            bookingData.selectedDishes = selectedDishes;
            bookingData.totalAmount = document.getElementById('totalAmount').textContent;
            
            // Simulate booking submission
            localStorage.setItem('bookingData', JSON.stringify(bookingData)); // Lưu thông tin nếu muốn dùng sau
            window.location.href = 'thongbao.html';
            
            // Reset form
            this.reset();
            document.querySelectorAll('.quantity').forEach(q => q.textContent = '0');
            updateTotalAmount();
        });
    }

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // Initialize total amount
    updateTotalAmount();
});

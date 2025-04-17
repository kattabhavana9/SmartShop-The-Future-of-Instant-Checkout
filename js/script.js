(function($) {
  "use strict";

  var cart = {
    items: [],
    total: 0,
    updateCart: function() {
      var $cartItems = $('.cart-items');
      var $cartTotal = $('.cart-total');
      var $checkoutBtn = $('#checkout-btn');

      $cartItems.empty();
      this.total = 0;

      if (this.items.length === 0) {
        $cartItems.append('<li class="list-group-item text-center">Your cart is empty</li>');
        $cartTotal.text('₹0.00');
        if ($checkoutBtn.length) $checkoutBtn.prop('disabled', true);
        return;
      }

      this.items.forEach(function(item) {
        var itemTotal = item.price * item.quantity;
        $cartItems.append(`
          <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">${item.name}</h6>
              <small class="text-body-secondary">Qty: ${item.quantity}</small>
              <button class="btn btn-danger btn-sm mt-2 remove-item" data-name="${item.name}">Remove</button>
            </div>
            <span class="text-body-secondary">₹${itemTotal.toFixed(2)}</span>
          </li>
        `);
        cart.total += itemTotal;
      });

      $cartTotal.text(`₹${cart.total.toFixed(2)}`);
      if ($checkoutBtn.length) $checkoutBtn.prop('disabled', false);
    },
    addItem: function(name, price) {
      var quantity = parseInt($(`[data-name="${name}"]`).closest('.product-item').find('#quantity').val()) || 1;
      var existingIndex = this.items.findIndex(item => item.name === name);

      if (existingIndex !== -1) {
        this.items.splice(existingIndex, 1); // Remove old item
      }

      this.items.push({ name: name, price: price, quantity: quantity }); // Add new item at the end
      this.updateCart();
      updateDropdownCart(this.items); // update dropdown
    },
    removeItem: function(name) {
      this.items = this.items.filter(item => item.name !== name);
      this.updateCart();
      updateDropdownCart(this.items); // update dropdown
    }
  };

  // 👉 This updates the dropdown cart section
  function updateDropdownCart(cartItems) {
    var $cartItemsList = $('#cart-items-list');
    var $dropdownTotal = $('#dropdown-total');
    var $cartTotalTop = $('#total-amount');
    var $checkoutBtnWrapper = $('#checkout-btn-wrapper');

    $cartItemsList.empty();
    let total = 0;

    if (cartItems.length === 0) {
      $cartItemsList.html('<li class="text-center">Your cart is empty.</li>');
      $dropdownTotal.text('0.00');
      $cartTotalTop.text('0.00');
      $checkoutBtnWrapper.addClass('d-none');
      return;
    }

    cartItems.forEach(function(item) {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      $cartItemsList.append(`
        <li class="mb-2 d-flex justify-content-between align-items-start">
          <div>
            <div class="fw-semibold">${item.name}</div>
            <div class="small text-muted">Qty: ${item.quantity}</div>
          </div>
          <div class="text-end">
            <div>₹${itemTotal.toFixed(2)}</div>
            <button class="btn btn-sm btn-link text-danger p-0 remove-item" data-name="${item.name}">Remove</button>
          </div>
        </li>
      `);
    });

    $dropdownTotal.text(total.toFixed(2));
    $cartTotalTop.text(total.toFixed(2));
    $checkoutBtnWrapper.removeClass('d-none');
  }

  var initPreloader = function() {
    $(document).ready(function($) {
      var Body = $('body');
      Body.addClass('preloader-site');
    });
    $(window).on('load', function() {
      $('.preloader-wrapper').fadeOut();
      $('body').removeClass('preloader-site');
    });
  };

  var initSwiper = function() {
    var swiper = new Swiper(".main-swiper", {
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    var category_swiper = new Swiper(".category-carousel", {
      slidesPerView: 6,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".category-carousel-next",
        prevEl: ".category-carousel-prev",
      },
      breakpoints: {
        0: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        991: { slidesPerView: 4 },
        1500: { slidesPerView: 6 },
      }
    });

    var brand_swiper = new Swiper(".brand-carousel", {
      slidesPerView: 4,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".brand-carousel-next",
        prevEl: ".brand-carousel-prev",
      },
      breakpoints: {
        0: { slidesPerView: 2 },
        768: { slidesPerView: 2 },
        991: { slidesPerView: 3 },
        1500: { slidesPerView: 4 },
      }
    });

    var products_swiper = new Swiper(".products-carousel", {
      slidesPerView: 5,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".products-carousel-next",
        prevEl: ".products-carousel-prev",
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 3 },
        991: { slidesPerView: 4 },
        1500: { slidesPerView: 6 },
      }
    });
  };

  var initProductQty = function() {
    $('.product-qty').each(function() {
      var $el_product = $(this);
      var $quantityInput = $el_product.find('#quantity');

      $el_product.find('.quantity-right-plus').click(function(e) {
        e.preventDefault();
        var quantity = parseInt($quantityInput.val());
        $quantityInput.val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function(e) {
        e.preventDefault();
        var quantity = parseInt($quantityInput.val());
        if (quantity > 1) {
          $quantityInput.val(quantity - 1);
        }
      });
    });

    $('.add-to-cart').click(function(e) {
      e.preventDefault();
      var name = $(this).data('name');
      var price = parseFloat($(this).data('price'));
      cart.addItem(name, price);
    });

    $(document).on('click', '.remove-item', function(e) {
      e.preventDefault();
      var name = $(this).data('name');
      cart.removeItem(name);
    });
  };

  var initCartDisplay = function() {
    var $cartModal = $('#cartModal');

    $cartModal.on('show.bs.modal', function () {
      cart.updateCart();
    });

    $('#show-cart-btn').click(function() {
      $cartModal.modal('show');
    });
  };

  var initJarallax = function() {
    jarallax(document.querySelectorAll(".jarallax"));
    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
    });
  };

  $(document).ready(function() {
    initPreloader();
    initSwiper();
    initProductQty();
    initCartDisplay();
    initJarallax();
  });
})(jQuery);



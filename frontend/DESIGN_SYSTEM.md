# 🎨 Perabot Megah Inventory System - Design System

A comprehensive, mobile-first design system built with modern CSS that provides a consistent, accessible, and beautiful user experience across all devices.

## 📁 File Structure

```
frontend/
├── styles.css              # Main stylesheet (imports everything)
├── design-system.css       # Design tokens & core utilities
├── components.css          # Component library
├── layout.css             # Layout & page structure
└── DESIGN_SYSTEM.md       # This documentation
```

## 🎯 Design Principles

- **Mobile-First**: Designed for mobile devices first, then enhanced for larger screens
- **Accessibility**: WCAG compliant with proper focus states and screen reader support
- **Performance**: Optimized animations and transitions
- **Modularity**: Reusable components that can be mixed and matched
- **Consistency**: Unified design language across all interfaces

## 🎨 Color Palette

### Primary Colors
- `--primary-50` to `--primary-900`: Blue spectrum for primary actions
- `--primary-600`: Main primary color (#2563eb)

### Secondary Colors
- `--secondary-50` to `--secondary-900`: Green spectrum for success states
- `--secondary-500`: Main secondary color (#10b981)

### Neutral Colors
- `--neutral-50` to `--neutral-900`: Grayscale for text and backgrounds
- `--neutral-50`: Light background (#f9fafb)
- `--neutral-800`: Primary text (#1f2937)

### Semantic Colors
- `--success-*`: Green for success states
- `--warning-*`: Yellow/Orange for warnings
- `--error-*`: Red for errors
- `--info-*`: Blue for informational content

## 📝 Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: System fonts (Segoe UI, -apple-system, etc.)

### Font Sizes
```css
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */
--text-5xl: 3rem      /* 48px */
```

### Font Weights
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

### Line Heights
```css
--leading-none: 1
--leading-tight: 1.25
--leading-snug: 1.375
--leading-normal: 1.5
--leading-relaxed: 1.625
--leading-loose: 2
```

## 📏 Spacing System

### Spacing Scale
```css
--space-0: 0
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-5: 1.25rem    /* 20px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
--space-24: 6rem      /* 96px */
```

## 🔲 Border Radius

```css
--border-radius: 0.375rem    /* 6px */
--border-radius-sm: 0.25rem  /* 4px */
--border-radius-md: 0.5rem   /* 8px */
--border-radius-lg: 0.75rem  /* 12px */
--border-radius-xl: 1rem     /* 16px */
--border-radius-2xl: 1.5rem  /* 24px */
--border-radius-full: 9999px
```

## 🌟 Shadows

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
--shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

## ⚡ Transitions

```css
--transition-fast: 150ms ease-in-out
--transition-normal: 250ms ease-in-out
--transition-slow: 350ms ease-in-out
```

## 🧩 Components

### Buttons

#### Basic Button
```html
<button class="btn btn-primary">Primary Button</button>
```

#### Button Variants
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-outline">Outline</button>
```

#### Button Sizes
```html
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-xl">Extra Large</button>
```

#### Button Width
```html
<button class="btn btn-primary btn-block">Full Width</button>
```

### Forms

#### Form Group
```html
<div class="form-group">
  <label class="form-label required">Email Address</label>
  <input type="email" class="form-input" placeholder="Enter your email">
  <div class="form-help">We'll never share your email.</div>
</div>
```

#### Form Input Types
```html
<input type="text" class="form-input" placeholder="Text input">
<select class="form-select">
  <option>Select option</option>
</select>
<textarea class="form-textarea" placeholder="Textarea"></textarea>
```

#### Form Layout
```html
<div class="form-row">
  <div class="form-group">
    <label class="form-label">First Name</label>
    <input type="text" class="form-input">
  </div>
  <div class="form-group">
    <label class="form-label">Last Name</label>
    <input type="text" class="form-input">
  </div>
</div>

<div class="form-row full-width">
  <div class="form-group">
    <label class="form-label">Full Address</label>
    <textarea class="form-textarea"></textarea>
  </div>
</div>
```

### Cards

#### Basic Card
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <p class="card-subtitle">Card subtitle</p>
  </div>
  <div class="card-body">
    <p>Card content goes here.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

#### Interactive Card
```html
<div class="card card-interactive">
  <div class="card-body">
    <h3>Clickable Card</h3>
    <p>This card has hover effects.</p>
  </div>
</div>
```

#### Elevated Card
```html
<div class="card card-elevated">
  <div class="card-body">
    <h3>Elevated Card</h3>
    <p>This card has enhanced shadows.</p>
  </div>
</div>
```

### Navigation Cards
```html
<div class="nav-card">
  <div class="card-icon">
    <i class="fas fa-chart-line"></i>
  </div>
  <h2>Dashboard</h2>
  <p>View your inventory statistics and trends.</p>
  <div class="card-action">
    View Dashboard <i class="fas fa-arrow-right"></i>
  </div>
</div>
```

### Stats Cards
```html
<div class="stat-card">
  <h3>Total Sales</h3>
  <div class="value">$24,500</div>
  <div class="change positive">+12.5% from last month</div>
</div>
```

### Tables

#### Basic Table
```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td>john@example.com</td>
        <td>Admin</td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Responsive Table
```html
<div class="table-responsive">
  <table class="table">
    <!-- Table content -->
  </table>
</div>
```

### Tabs
```html
<div class="tabs">
  <button class="tab-btn active">
    <i class="fas fa-home"></i> Home
  </button>
  <button class="tab-btn">
    <i class="fas fa-user"></i> Profile
  </button>
</div>
<div class="tab-content">
  <!-- Tab content -->
</div>
```

### Alerts
```html
<div class="alert alert-success">
  <div class="alert-icon">
    <i class="fas fa-check-circle"></i>
  </div>
  <div class="alert-content">
    <div class="alert-title">Success!</div>
    <div class="alert-message">Your changes have been saved.</div>
  </div>
</div>
```

### Toast Notifications
```html
<div class="toast-container">
  <div class="toast success">
    <i class="fas fa-check-circle"></i>
    <span>Success message</span>
  </div>
</div>
```

### Modals
```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-header">
      <h3 class="modal-title">Modal Title</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p>Modal content goes here.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Save</button>
    </div>
  </div>
</div>
```

## 🎯 Utility Classes

### Typography
```css
.text-xs, .text-sm, .text-base, .text-lg, .text-xl, .text-2xl, .text-3xl, .text-4xl, .text-5xl
.font-light, .font-normal, .font-medium, .font-semibold, .font-bold, .font-extrabold
.leading-none, .leading-tight, .leading-snug, .leading-normal, .leading-relaxed, .leading-loose
.text-left, .text-center, .text-right, .text-justify
```

### Spacing
```css
.m-0, .m-1, .m-2, .m-3, .m-4, .m-5, .m-6, .m-8, .m-10, .m-12, .m-16, .m-20, .m-24
.p-0, .p-1, .p-2, .p-3, .p-4, .p-5, .p-6, .p-8, .p-10, .p-12, .p-16, .p-20, .p-24
.mx-auto
```

### Layout
```css
.flex, .inline-flex, .grid, .block, .inline-block, .hidden
.flex-col, .flex-row, .flex-wrap, .flex-nowrap
.items-center, .items-start, .items-end, .items-stretch
.justify-center, .justify-start, .justify-end, .justify-between, .justify-around
.gap-1, .gap-2, .gap-3, .gap-4, .gap-5, .gap-6, .gap-8
.w-full, .w-auto, .h-full, .h-auto
```

### Colors
```css
.text-primary, .text-secondary, .text-success, .text-warning, .text-error, .text-info
.bg-primary, .bg-secondary, .bg-success, .bg-warning, .bg-error, .bg-info
.border-primary, .border-secondary, .border-success, .border-warning, .border-error, .border-info
```

### Borders & Shadows
```css
.rounded, .rounded-sm, .rounded-md, .rounded-lg, .rounded-xl, .rounded-2xl, .rounded-full
.shadow-sm, .shadow, .shadow-md, .shadow-lg, .shadow-xl
```

### Transitions
```css
.transition, .transition-fast, .transition-slow
```

### Display & Position
```css
.d-block, .d-inline-block, .d-inline, .d-flex, .d-inline-flex, .d-grid, .d-none
.position-relative, .position-absolute, .position-fixed, .position-sticky
.overflow-hidden, .overflow-auto, .overflow-scroll, .overflow-x-auto, .overflow-y-auto
```

## 📱 Responsive Design

### Breakpoints
```css
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
--breakpoint-2xl: 1536px
```

### Responsive Utilities
```css
.sm:hidden, .sm:block, .sm:flex, .sm:grid
.md:hidden, .md:block, .md:flex, .md:grid
.lg:hidden, .lg:block, .lg:flex, .lg:grid
.xl:hidden, .xl:block, .xl:flex, .xl:grid
```

### Mobile-First Approach
- Base styles are mobile-first
- Larger screen styles are added with media queries
- Touch targets are minimum 44px on mobile
- Tables become horizontally scrollable on small screens

## ♿ Accessibility Features

### Focus Management
- Visible focus indicators on all interactive elements
- Proper tab order
- Skip links for screen readers

### Screen Reader Support
- Semantic HTML structure
- ARIA labels where needed
- Proper heading hierarchy

### Color Contrast
- WCAG AA compliant color combinations
- High contrast mode support
- Reduced motion support

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Proper focus management
- Escape key support for modals

## 🚀 Performance Features

### CSS Optimizations
- Hardware-accelerated animations with `will-change`
- Efficient transitions and transforms
- Minimal repaints and reflows

### Loading States
- Skeleton loading animations
- Spinner components
- Progressive enhancement

## 🛠️ Browser Support

### Modern Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks
- CSS Grid fallback to Flexbox
- CSS Custom Properties fallback to static values
- Progressive enhancement approach

## 📖 Usage Examples

### Complete Form Example
```html
<div class="form-container">
  <div class="form-row">
    <div class="form-group">
      <label class="form-label required">First Name</label>
      <input type="text" class="form-input" placeholder="Enter first name">
    </div>
    <div class="form-group">
      <label class="form-label required">Last Name</label>
      <input type="text" class="form-input" placeholder="Enter last name">
    </div>
  </div>
  
  <div class="form-row full-width">
    <div class="form-group">
      <label class="form-label">Email</label>
      <input type="email" class="form-input" placeholder="Enter email address">
    </div>
  </div>
  
  <div class="form-actions">
    <button class="btn btn-secondary">Cancel</button>
    <button class="btn btn-primary">Save Changes</button>
  </div>
</div>
```

### Dashboard Layout Example
```html
<div class="dashboard-content">
  <div class="stats-grid">
    <div class="stat-card">
      <h3>Total Sales</h3>
      <div class="value">$24,500</div>
      <div class="change positive">+12.5%</div>
    </div>
    <div class="stat-card">
      <h3>Orders</h3>
      <div class="value">156</div>
      <div class="change positive">+8.2%</div>
    </div>
  </div>
  
  <div class="chart-container">
    <h3>Sales Trend</h3>
    <div class="chart-wrapper">
      <!-- Chart content -->
    </div>
  </div>
</div>
```

## 🔧 Customization

### Overriding Design Tokens
```css
:root {
  --primary-600: #your-custom-color;
  --border-radius-lg: 16px;
  --space-4: 1.5rem;
}
```

### Component Modifications
```css
/* Custom button variant */
.btn-custom {
  background: linear-gradient(45deg, var(--primary-500), var(--primary-600));
  border: none;
  color: white;
  box-shadow: var(--shadow-lg);
}

/* Custom card variant */
.card-custom {
  background: linear-gradient(135deg, var(--neutral-50), white);
  border: 2px solid var(--primary-200);
}
```

## 📚 Best Practices

1. **Use Design Tokens**: Always use CSS custom properties for consistency
2. **Mobile-First**: Start with mobile styles, then enhance for larger screens
3. **Semantic HTML**: Use proper HTML elements for accessibility
4. **Progressive Enhancement**: Ensure basic functionality works without JavaScript
5. **Performance**: Minimize CSS complexity and optimize animations
6. **Accessibility**: Test with screen readers and keyboard navigation

## 🐛 Troubleshooting

### Common Issues

#### Styles Not Loading
- Check file paths in `styles.css`
- Ensure all CSS files are in the correct directory
- Verify CSS imports are working

#### Mobile Styles Not Applied
- Check viewport meta tag in HTML
- Ensure media queries are properly structured
- Test on actual mobile devices

#### Performance Issues
- Reduce number of CSS rules
- Optimize animations with `will-change`
- Use efficient selectors

### Debug Mode
Add this CSS for debugging:
```css
* {
  outline: 1px solid red !important;
}
```

## 📞 Support

For questions or issues with the design system:
1. Check this documentation first
2. Review the CSS files for examples
3. Test in different browsers and devices
4. Ensure proper HTML structure

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintainer**: Development Team

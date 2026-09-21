# E-Commerce Frontend

This repository contains the React + Vite frontend for the e-commerce application. The backend runs separately and owns authentication, products, inventory, cart operations, checkout, PostgreSQL, and AWS image storage.

The frontend owns the user interface, routing, browser authentication state, API calls, loading/error states, and customer/admin workflows.

## Current implementation

The current development branch replaces the earlier placeholder storefront with a working customer shopping flow:

- Customer login and registration with persisted browser sessions.
- Protected dashboard, catalog browsing, product details, profile, cart, and checkout routes.
- Catalog loading from categories -> subcategories -> products, with cached data, category filters, featured picks, and client-side product search.
- Product cards and details use only fields returned by the API, including optional image, price, stock, brand, and description fields.
- Add/remove cart operations are backed by the API, with a per-customer browser-side cart because the backend has no cart-read endpoint.
- Checkout receipt rendering for order, product, shipping, GST, and total fields, including the backend's `reciept` spelling.
- Shared Axios authentication headers, customer access-token refresh/retry, normalized API errors, and loading/empty/error/retry states.
- A refreshed blue-and-white responsive storefront UI with reusable navigation, auth, search, product, scroller, icon, and feedback components.

The old `Home` page and admin page files remain in the source tree for follow-up work, but they are not currently registered as routes. The active application is customer-focused; admin API support is limited to the functions implemented in `src/services/adminApi.js`.

## Running the frontend

```powershell
cd frontend
npm install
npm run dev
```

The backend should run separately on its own port. The current frontend configuration expects:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Create `frontend/.env` with the variable above when setting up a new machine. The previous branch-provided `.env.example` file is no longer present. Never commit `.env` or secrets.

Useful commands:

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run Oxlint
```

## Source structure

```text
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   └── admin/
│   ├── context/
│   ├── services/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env
├── package.json
└── vite.config.js
```

`src/App.jsx` now composes the providers and route table; page UI lives in the page and component modules. `src/pages/Home.jsx` and `src/pages/admin/*` are retained as unregistered/legacy screens until their corresponding flows are wired into the application.

## Application control flow

### 1. Browser startup

`src/main.jsx` is the browser entry point. It imports global CSS, creates the React root, wraps the application in `BrowserRouter`, and renders `App`.

```text
main.jsx
  → BrowserRouter
    → App.jsx
      → AuthProvider
        → CartProvider
          → Routes and page components
```

### 2. Routing

`src/App.jsx` should eventually be responsible only for application composition and routes. It should not contain the detailed UI for every page.

A route change is handled like this:

```text
User clicks a Link
  → React Router changes the URL
  → matching page component renders
  → page calls a service when data is needed
  → service calls the backend through api.js
  → page displays loading, data, empty, or error state
```

Customer routes (all except auth screens require a customer session):

```text
/                         Redirects to `/dashboard`
/dashboard                Authenticated storefront dashboard
/products                 Legacy product-list screen (not currently linked)
/products/:id             Product details
/cart                     Cart
/checkout                 Checkout
/login                    Customer login
/register                 Customer registration
/profile                  Customer profile
```

There are currently no active admin routes in `App.jsx`.

Protected routes must check customer authentication before rendering. Unauthenticated customers are sent to `/login`. Admin route protection is not active because no admin routes are currently registered.

### 3. Authentication flow

`AuthContext.jsx` owns browser authentication state for the customer flow.

```text
Login form
  → AuthContext.login()
  → authApi.login()
  → api.js sends POST /cus/login
  → access and refresh tokens are stored
  → AuthContext exposes the logged-in state
  → protected routes become available
```

Customer and admin tokens must remain separate. Customer requests use the customer access token. Admin requests use the admin access token.

When a customer access token expires:

```text
Protected API request fails
  → api.js checks the failure
  → POST /cus/refresh with the stored refresh token
  → store replacement tokens
  → retry the original request
  → if refresh fails, clear auth and redirect to /login
```

The backend may return HTTP 500 for an invalid access token, so the API layer must handle authentication failures reported as 401, 403, or the backend's known 500 response.

### 4. Catalog flow

```text
Categories page
  → catalogApi.getCategories()
  → GET /cus/categories/get_all
  → render category names

Subcategories page
  → catalogApi.getSubcategories(categoryId)
  → GET /cus/categories/all_sub/:id
  → render subcategory names

Products page
  → catalogApi.getProducts(categoryId, subcategoryId)
  → GET /cus/categories/:cid/sub/:sid/products
  → render product name and image_url
```

The current backend does not guarantee product prices, stock, brands, or descriptions in the customer product response. The frontend must not invent these fields.

### 5. Cart and checkout flow

```text
ProductCard add button
  → CartContext.add(name)
  → cartApi.add(name, quantity)
  → POST /cus/cart/add
  → update the local cart display

Cart remove button
  → CartContext.remove(name)
  → cartApi.remove(name)
  → DELETE /cus/cart/del
  → update the local cart display

Checkout button
  → cartApi.checkout()
  → POST /cus/cart/check_out
  → receive the server receipt
  → clear local cart
  → navigate to order success
```

The server is authoritative for cost, GST, shipping, and final total. The backend currently does not expose `GET /cus/cart`, so the frontend cannot rebuild the cart from the server after a browser refresh unless that endpoint is added later.

The backend may spell the receipt field as `reciept`; the service layer should support that real response spelling and should not make components know about it.

## File responsibilities

### `src/main.jsx`

- Starts the React application.
- Imports `index.css`.
- Creates the root with `createRoot`.
- Provides `BrowserRouter` around `App`.
- Does not contain page or API logic.

### `src/App.jsx`

- Composes the providers.
- Declares the React Router route table.
- Connects routes to page components.
- Applies protected-route wrappers.
- Should stay small and should not contain full page implementations.

### `src/App.css`

- Styles reusable application UI.
- Contains layout, buttons, cards, forms, navigation, responsive rules, loading states, and error states.
- Should not contain API logic or component state.

### `src/index.css`

- Contains global browser styles and typography defaults.
- Should contain resets and global CSS variables only.

## Components

Components are reusable pieces shared by multiple pages. They should receive data and callbacks through props instead of directly owning page-level API requests.

### `src/components/Navbar.jsx`

- Displays the brand and main navigation links.
- Shows login/register links when logged out.
- Shows the current user and logout action when logged in.
- Shows the cart link and item count for customers.
- Shows the admin link for admins.

### `src/components/Footer.jsx`

- Displays the shared footer.
- Contains no business logic.

### `src/components/ProductCard.jsx`

- Displays one product image and product name.
- Provides an add-to-cart action.
- Must not invent a price or product field missing from the backend response.

### `src/components/ProductGrid.jsx`

- Receives a product array.
- Renders `ProductCard` for each product.
- Handles empty product lists with an empty state.

### `src/components/CategoryCard.jsx`

- Displays one category or subcategory.
- Links to the appropriate catalog route.

### `src/components/SearchBar.jsx`

- Owns the search input UI.
- Reports the entered value through a callback.
- Should not call the backend until a documented search endpoint exists.

### `src/components/Loading.jsx`

- Displays a simple loading message or spinner.
- Should be reusable on all data-loading pages.

### `src/components/ProtectedRoute.jsx`

- Checks customer authentication state.
- Redirects unauthenticated users to `/login`.
- Admin protection may use a separate admin route guard or a type-aware version of this component.

## Customer pages

### `src/pages/Home.jsx`

- Landing page for the storefront.
- Links users to categories and account actions.
- Should not fetch data that belongs to the catalog page unless required by the design.

### `src/pages/Products.jsx`

- Reads category/subcategory route parameters.
- Calls `catalogApi`.
- Renders loading, error, empty, and product-grid states.

### `src/pages/ProductDetails.jsx`

- Displays one selected product.
- Uses only fields returned by the backend.
- Provides add-to-cart behavior when the product identity is known.

### `src/pages/Cart.jsx`

- Reads items from `CartContext`.
- Displays quantities and remove actions.
- Links to checkout.
- Does not call the backend directly.

### `src/pages/Checkout.jsx`

- Shows the current local cart summary.
- Calls the checkout service.
- Displays processing and error states.
- Uses the backend response as the source of truth for order totals.

### `src/pages/Login.jsx`

- Displays the customer login form.
- Collects `name`, `email`, and `password`.
- Calls `AuthContext.login()`.
- Does not manually create authorization headers.

### `src/pages/Register.jsx`

- Displays the customer registration form.
- Collects `name`, `email`, `password`, `main_address`, `secondary_address`, and `DOB`.
- Calls `AuthContext.register()`.

### `src/pages/Profile.jsx`

- Displays the authenticated customer's local account information.
- Should not imply that unsupported profile endpoints exist.
- New profile API calls require a documented backend endpoint.

## Admin pages

### `src/pages/admin/AdminLogin.jsx`

- Displays the admin login form.
- Calls the admin authentication flow.
- Must keep admin authentication separate from customer authentication.

### `src/pages/admin/Dashboard.jsx`

- Provides navigation to admin management pages.
- Displays simple administrative status or actions.

### `src/pages/admin/Categories.jsx`

- Creates, updates, and deletes categories through `adminApi`.
- Uses confirmation dialogs before destructive actions.

### `src/pages/admin/Subcategories.jsx`

- Creates, updates, and deletes subcategories through `adminApi`.
- Requires the selected category relationship.

### `src/pages/admin/Products.jsx`

- Creates, updates, and deletes products through `adminApi`.
- Uses multipart form data for product fields and images.
- Backend fields include `prod`, `stock`, `brand`, `desc`, `price`, and `images`.
- Must not expose AWS credentials in the browser.

## Context files

### `src/context/AuthContext.jsx`

Provides:

```js
{
  user,
  userType,
  isAuthenticated,
  accessToken,
  login,
  logout,
  register,
  refreshSession
}
```

It stores authentication state and user details in local storage, exposes login/register/logout actions, and keeps customer and admin token keys separate. Access-token refresh and request retry are handled by `src/services/api.js`.

### `src/context/CartContext.jsx`

- Stores the current browser cart display.
- Calls `cartApi` for add/remove actions.
- Exposes `items`, `add`, `remove`, and `clear`.
- Does not calculate final checkout prices.

## Service files

All HTTP communication belongs in `src/services`. Components and pages should call service functions instead of writing Axios requests themselves.

### `src/services/api.js`

- Creates the single Axios instance.
- Reads `VITE_API_BASE_URL`.
- Adds authorization headers.
- Handles access-token refresh and request retry.
- Normalizes common API errors.
- Must not contain page UI.

### `src/services/authApi.js`

- Calls customer signup/login/refresh endpoints.
- Calls admin signup/login/refresh endpoints when implemented.
- Parses the backend response envelope: `status`, `msg`, and `data`.

### `src/services/catalogApi.js`

- Calls customer category, subcategory, and product endpoints.
- Converts safe response shapes into values pages can render.
- Does not create fake IDs, prices, or products.

### `src/services/cartApi.js`

- Calls add, delete, and checkout endpoints.
- Sends exactly the documented request bodies.
- Handles both `reciept` and `receipt` response spellings.

### `src/services/adminApi.js`

- Contains admin category, subcategory, and product CRUD calls.
- Sends admin authorization through the shared Axios layer.
- Builds multipart requests for product images.

## Backend contract

Customer endpoints:

```text
POST   /cus/signup
POST   /cus/login
POST   /cus/refresh
GET    /cus/categories/get_all
GET    /cus/categories/all_sub/:id
GET    /cus/categories/:cid/sub/:sid/products
POST   /cus/cart/add
DELETE /cus/cart/del
POST   /cus/cart/check_out
```

Admin endpoints:

```text
POST   /admin/signup
POST   /admin/login
POST   /admin/refresh
POST   /admin/add_categories
DELETE /admin/delete_categories
PUT    /admin/update_categories
POST   /admin/categories/add_subs
DELETE /admin/categories/del_subs
PUT    /admin/categories/upd_subs
POST   /admin/categories/:cid/sub/:sid/add
DELETE /admin/categories/:cid/sub/:sid/del
PUT    /admin/categories/:cid/sub/:sid/upd
```

Do not invent endpoints. If the backend does not expose an operation, display a clear unavailable state or wait until the backend is extended.

## Development rules

1. Keep backend and frontend as separate applications.
2. Keep API calls inside `src/services`.
3. Keep authentication state inside `AuthContext`.
4. Keep cart display state inside `CartContext`.
5. Do not store secrets in Vite environment variables.
6. Do not create fake prices, IDs, stock, or product details.
7. Validate external API data before rendering it.
8. Provide loading, error, empty, and retry states.
9. Keep the UI simple and avoid unnecessary animation.
10. Run `npm run build` and `npm run lint` before committing frontend changes.

## Frontend design system

The React storefront follows a clean blue-and-white visual language: white surfaces, deep blue promotional areas, bright blue actions, dark navy text, and light gray borders. Use these rules when creating or updating frontend pages and components.

### Color palette

| Usage | Color | Hex |
| --- | --- | --- |
| Primary button and action | Blue 600 | `#2563EB` |
| Promo banner and dark blue areas | Blue 700 | `#1A46B6` |
| Light blue background | Blue 50 | `#F0F7FF` |
| Main background and surfaces | White | `#FFFFFF` |
| Main text and headings | Gray 900 | `#0F172A` |
| Body and secondary text | Gray 600 | `#475566` |
| Borders | Gray 200 | `#E2E8F0` |
| Soft backgrounds and footer | Gray 50 | `#F8FAFC` |

Use `#2563EB` for primary buttons, active category tabs, links, and other key actions. Use `#1A46B6` for promotional banners. Keep the page and header backgrounds white. Use `#F8FAFC` for search/filter controls and other low-emphasis surfaces. Cards and form inputs should use `#E2E8F0` borders.

### Product placeholder colors

When a product image is unavailable, use one of these soft placeholder colors:

- Light blue: `#DBEBFF`
- Pale cyan: `#E6F2FA`
- Pale purple: `#EDE6FF`
- Pale orange: `#FFEDD6`

### Typography

Use Inter throughout the React app:

```css
body {
  font-family: Inter, system-ui, sans-serif;
}
```

Supported weights are Regular (`400`), Semi Bold (`600`), and Bold (`700`). Use the following sizes as the default scale:

| Element | Size |
| --- | ---: |
| Logo | `24px` |
| Hero heading | `34px` |
| Page heading | `28px` |
| Card title | `15px` |
| Navigation text | `14px` |
| Button text | `12–14px` |
| Body text | `13–15px` |
| Form labels | `12px` |
| Helper text | `12px` |

### Component usage

- Keep headers and page backgrounds white.
- Use bright blue primary buttons with white text and clear hover/focus states.
- Use dark navy text for headings and gray secondary text for descriptions and metadata.
- Use light gray borders for cards, inputs, dividers, and form controls.
- Use the active blue category tab with inactive tabs on `#F8FAFC`.
- Keep spacing, border radii, and button treatments consistent across pages.
- Prefer simple, accessible layouts over unnecessary animation or decorative effects.

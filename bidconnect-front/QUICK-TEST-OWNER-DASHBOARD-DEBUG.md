# DEBUG: Owner Dashboard Black Screen Issue

## Problem
When logging in as OWNER, the dashboard shows a black empty page.

## Debugging Steps

### 1. Check Browser Console
Open browser console (F12) and navigate to `/login`, then login as OWNER.

Look for:
- Component loading errors
- Template loading errors  
- Console.log messages from the component
- Network errors

### 2. Expected Console Logs
You should see:
```
OwnerDashboard: ngOnInit called
Current user: {id: '1', email: 'owner@test.com', ...}
OwnerDashboard: loadTenders called
Loading tenders for owner: 1
Tenders loaded: [3 tenders array]
```

### 3. Check Network Tab
- Should see no HTTP requests (MOCK_MODE = true)
- No 404 errors for template or CSS files

### 4. Check Elements Tab
- Inspect the page DOM
- Look for `<app-owner-dashboard>` element
- Check if `.dashboard-container` exists
- Verify if elements have `display: none` or `opacity: 0`

## Potential Causes

### A. Template Not Loading
- File path issue in `templateUrl`
- Build issue with lazy-loaded component

### B. CSS Issue
- Elements hidden by CSS
- Opacity set to 0
- Display set to none

### C. Data Loading Issue
- Service not returning data
- Observable not completing
- Error in subscription

### D. Timing Issue
- GSAP animation hiding elements
- Race condition with data loading

## Quick Fix Attempts

### Fix 1: Simplify Template (Test)
Replace the entire HTML with:
```html
<div style="color: white; padding: 20px;">
  <h1>OWNER DASHBOARD TEST</h1>
  <p>If you see this, the template is loading!</p>
  <p>User: {{ currentUser()?.email }}</p>
  <p>Tenders count: {{ tenders().length }}</p>
  <p>Loading: {{ isLoading() }}</p>
</div>
```

### Fix 2: Check Component Export
Verify in `owner-dashboard.ts`:
```typescript
export class OwnerDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
```

### Fix 3: Check Route Configuration
Verify in `app.routes.ts`:
```typescript
{
  path: 'owner',
  loadComponent: () => import('./features/dashboards/owner/owner-dashboard').then(m => m.OwnerDashboardComponent),
  canActivate: [authGuard],
  data: { roles: ['OWNER'] }
}
```

## Current Status
- Build: ✅ Successful
- Server: ✅ Running on http://localhost:4200
- Console logs: ✅ Added for debugging
- Template: ✅ Exists and has content
- CSS: ✅ Exists and has proper styles

## Next Steps
1. Open browser and test
2. Check console for logs
3. Inspect DOM elements
4. Report findings

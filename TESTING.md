# Frontend Testing Checklist - Scheduled Posts

## ✅ **TESTING GUIDE**

This document provides a complete testing checklist for the SocialSync frontend, specifically for scheduled posts functionality.

---

## 🚀 **Setup Before Testing**

### **1. Start Backend Services**
```bash
docker-compose up -d
```

**Verify:**
- [ ] Backend API running: http://localhost:8000
- [ ] API Docs accessible: http://localhost:8000/docs
- [ ] Database healthy: `docker-compose ps db`
- [ ] Redis running: `docker-compose ps redis`
- [ ] Celery worker running: `docker-compose ps worker`

### **2. Start Frontend**
```bash
cd frontend
npm install  # First time only
npm run dev
```

**Verify:**
- [ ] Frontend running: http://localhost:3000
- [ ] No console errors in browser DevTools

---

## 📝 **TEST CASES**

### **Test Suite 1: Create Post**

#### **TC-01: Create Text-Only Scheduled Post**
**Steps:**
1. Open http://localhost:3000
2. Click "+ New Post" button
3. Enter caption: "Test scheduled post"
4. Select a date/time in the future (e.g., tomorrow 10:00 AM)
5. Enable one platform (e.g., Facebook)
6. Click "Create Posts"

**Expected:**
- [ ] Success message appears
- [ ] Modal closes
- [ ] Post appears in /posts page with "scheduled" status
- [ ] Scheduled time displays correctly

---

#### **TC-02: Create Instagram Single Image Post**
**Steps:**
1. Upload an image (jpg/png)
2. Enable Instagram
3. Select the uploaded image
4. Set scheduled time
5. Click "Create Posts"

**Expected:**
- [ ] Media validation shows "Ready for an Instagram image post"
- [ ] Post created successfully
- [ ] Post shows with media count: 1

---

#### **TC-03: Create Instagram Carousel Post (NEW)**
**Steps:**
1. Upload 3-5 images
2. Enable Instagram
3. Select all uploaded images (2-10 items)
4. Verify validation message
5. Set scheduled time
6. Click "Create Posts"

**Expected:**
- [ ] Validation shows "Ready for Instagram carousel (X items)"
- [ ] Post created successfully
- [ ] Backend accepts carousel (up to 10 items)

**Negative Tests:**
- [ ] Selecting 11+ images shows error: "maximum 10 media items"
- [ ] Mixing images + videos shows error: "must contain same media type"

---

#### **TC-04: Create Multi-Platform Post**
**Steps:**
1. Enter caption
2. Enable Facebook, Instagram, LinkedIn
3. Select media (if needed)
4. Configure each platform's settings
5. Click "Create Posts"

**Expected:**
- [ ] 3 posts created (one per platform)
- [ ] Each post has correct platform-specific settings
- [ ] Success message: "3 posts created successfully"

---

#### **TC-05: Create Immediate Post (No Schedule)**
**Steps:**
1. Enter caption
2. Leave scheduled time empty
3. Enable platform
4. Click "Create Posts"

**Expected:**
- [ ] Post created with "pending" status
- [ ] Can use "Publish Now" button

---

### **Test Suite 2: Posts Management**

#### **TC-06: View All Posts**
**Steps:**
1. Navigate to http://localhost:3000/posts
2. Check summary stats

**Expected:**
- [ ] Total posts count correct
- [ ] Scheduled count correct
- [ ] Published count correct
- [ ] Failed count correct
- [ ] Posts grouped by date
- [ ] "Last updated" timestamp visible

---

#### **TC-07: Auto-Refresh (NEW)**
**Steps:**
1. Open /posts page
2. Wait 30 seconds
3. Check "Last updated" timestamp

**Expected:**
- [ ] Posts automatically refresh every 30 seconds
- [ ] Timestamp updates
- [ ] No page reload (smooth update)

---

#### **TC-08: Manual Refresh (NEW)**
**Steps:**
1. Click "🔄 Refresh" button
2. Check timestamp

**Expected:**
- [ ] Posts reload immediately
- [ ] Timestamp updates
- [ ] Loading state shows briefly

---

#### **TC-09: Filter Posts by Status**
**Steps:**
1. Click "Scheduled" filter
2. Click "Published" filter
3. Click "Failed" filter
4. Click "All" filter

**Expected:**
- [ ] Each filter shows correct posts
- [ ] Count badges update
- [ ] Active filter highlighted

---

#### **TC-10: Search Posts**
**Steps:**
1. Enter platform name in search (e.g., "facebook")
2. Enter partial caption text
3. Clear search

**Expected:**
- [ ] Search filters posts correctly
- [ ] Case-insensitive matching
- [ ] Clearing search shows all posts

---

#### **TC-11: Publish Post Immediately**
**Steps:**
1. Find a scheduled post
2. Click "🚀 Publish Now" button
3. Wait for processing

**Expected:**
- [ ] Button shows "Working…" with spinner
- [ ] Post status changes to "processing"
- [ ] Eventually changes to "posted"
- [ ] Platform post ID appears

---

#### **TC-12: Cancel Scheduled Post**
**Steps:**
1. Find a pending/scheduled post
2. Click "✕ Cancel" button
3. Confirm action

**Expected:**
- [ ] Post status changes to "cancelled"
- [ ] Cancel button disabled
- [ ] Post moves to "Cancelled" filter

---

#### **TC-13: Edit Scheduled Post**
**Steps:**
1. Click "✏️ Edit" on a pending post
2. Modify caption or scheduled time
3. Save changes

**Expected:**
- [ ] Edit modal opens
- [ ] Changes saved successfully
- [ ] Updated time/content visible
- [ ] "Last updated" timestamp changes

---

### **Test Suite 3: Media Handling**

#### **TC-14: Upload Media**
**Steps:**
1. Open post composer
2. Select image file
3. Add alt text
4. Click "Upload"

**Expected:**
- [ ] Upload progress shows
- [ ] Media appears in list
- [ ] Alt text saved
- [ ] Success message appears

---

#### **TC-15: Media Validation by Platform**
**Steps:**
1. Upload different media types
2. Toggle between platforms
3. Check validation messages

**Expected:**
- [ ] Facebook: Allows text, single image, single video, or multi-image carousel
- [ ] Instagram: Requires 1-10 items, same type for carousel
- [ ] LinkedIn: Allows text, one image, or one video
- [ ] Twitter: Allows text, up to 4 images, or one video
- [ ] YouTube: Requires exactly one video + title

---

#### **TC-16: Multi-Select Media**
**Steps:**
1. Upload 5 images
2. Select 3 of them
3. Enable Facebook

**Expected:**
- [ ] Shows "Ready for a Facebook image set"
- [ ] Can create carousel post
- [ ] Media count displays correctly

---

### **Test Suite 4: Platform-Specific Settings**

#### **TC-17: Instagram Settings**
**Steps:**
1. Enable Instagram
2. Open Instagram settings
3. Select "Reel" mode
4. Add first comment
5. Create post

**Expected:**
- [ ] Settings saved with post
- [ ] First comment posted (if enabled)
- [ ] Reel mode applied

---

#### **TC-18: YouTube Settings**
**Steps:**
1. Upload video
2. Enable YouTube
3. Fill in: title, description, privacy, tags
4. Create post

**Expected:**
- [ ] All YouTube metadata saved
- [ ] Title required validation works
- [ ] Privacy settings applied
- [ ] Tags formatted correctly

---

#### **TC-19: Twitter Reply Settings**
**Steps:**
1. Enable Twitter
2. Change reply permissions to "Mentioned users"
3. Create post

**Expected:**
- [ ] Reply settings saved
- [ ] Post created with correct settings

---

### **Test Suite 5: Error Handling**

#### **TC-20: Backend Connection Error**
**Steps:**
1. Stop backend: `docker-compose stop backend`
2. Try to load posts

**Expected:**
- [ ] Error message displays
- [ ] Graceful degradation
- [ ] Can retry when backend restarts

---

#### **TC-21: Invalid Media**
**Steps:**
1. Try to create Instagram post with 0 media
2. Try to mix images + videos in Instagram carousel

**Expected:**
- [ ] Clear error messages
- [ ] Form prevents submission
- [ ] User guided to fix issues

---

#### **TC-22: Duplicate Post Prevention**
**Steps:**
1. Create a post
2. Immediately create identical post (same text + media)

**Expected:**
- [ ] Backend prevents duplicate (within 10 min window)
- [ ] Error message shown to user

---

### **Test Suite 6: UI/UX**

#### **TC-23: Responsive Design**
**Steps:**
1. Open on mobile viewport (< 768px)
2. Open on tablet viewport (768px - 1024px)
3. Open on desktop (> 1024px)

**Expected:**
- [ ] Layout adapts correctly
- [ ] Buttons accessible on mobile
- [ ] Text readable at all sizes
- [ ] Modals centered and scrollable

---

#### **TC-24: Loading States**
**Steps:**
1. Create post (watch button)
2. Publish now (watch button)
3. Refresh posts (watch button)

**Expected:**
- [ ] Buttons show loading spinners
- [ ] Buttons disabled during operation
- [ ] Visual feedback for all actions

---

#### **TC-25: Empty States**
**Steps:**
1. View posts with no posts created
2. View media with no uploads
3. Filter to show no results

**Expected:**
- [ ] Friendly empty state messages
- [ ] Call-to-action buttons
- [ ] Helpful guidance text

---

## 🐛 **Known Issues to Verify Fixed**

### **Issue #1: Instagram Carousel Support**
**Before:** Instagram only supported 1 image/video  
**After:** Instagram supports 1-10 items (carousel)  
**Test:** TC-03

### **Issue #2: No Auto-Refresh**
**Before:** Posts only loaded once on page load  
**After:** Posts auto-refresh every 30 seconds  
**Test:** TC-07

### **Issue #3: No Manual Refresh**
**Before:** Had to reload page to see updates  
**After:** Manual refresh button available  
**Test:** TC-08

### **Issue #4: No Last Updated Time**
**Before:** No indication of data freshness  
**After:** Timestamp shows last update time  
**Test:** TC-06

---

## ✅ **Final Checklist**

### **Before Pushing to Production:**
- [ ] All test cases pass
- [ ] No console errors in browser
- [ ] No TypeScript compilation errors
- [ ] Backend API returns correct data
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Mobile responsive tested
- [ ] All platforms tested (FB, IG, LI, Twitter, YT)
- [ ] Scheduled posts trigger correctly
- [ ] Immediate posts publish correctly
- [ ] Error messages are user-friendly
- [ ] Loading states work properly

---

## 📊 **Test Results Template**

```
Date: YYYY-MM-DD
Tester: [Name]
Environment: Local / Staging / Production

Test Suite 1: Create Post
- TC-01: ✅ PASS / ❌ FAIL
- TC-02: ✅ PASS / ❌ FAIL
- TC-03: ✅ PASS / ❌ FAIL
- TC-04: ✅ PASS / ❌ FAIL
- TC-05: ✅ PASS / ❌ FAIL

Test Suite 2: Posts Management
- TC-06: ✅ PASS / ❌ FAIL
- TC-07: ✅ PASS / ❌ FAIL
- TC-08: ✅ PASS / ❌ FAIL
- TC-09: ✅ PASS / ❌ FAIL
- TC-10: ✅ PASS / ❌ FAIL
- TC-11: ✅ PASS / ❌ FAIL
- TC-12: ✅ PASS / ❌ FAIL
- TC-13: ✅ PASS / ❌ FAIL

[... continue for all test suites ...]

Issues Found:
1. [Description]
2. [Description]

Notes:
[Any additional observations]
```

---

## 🚀 **Quick Smoke Test (5 minutes)**

If you're short on time, run these critical tests:

1. ✅ Create a scheduled post (any platform)
2. ✅ Verify it appears in /posts with correct status
3. ✅ Click "Publish Now" and watch it process
4. ✅ Verify auto-refresh updates the status
5. ✅ Try Instagram carousel with 3 images
6. ✅ Check mobile responsive layout

If all 6 pass, the core functionality is working! 🎉

---

## 📞 **Support**

If you encounter issues:
1. Check browser console for errors
2. Verify backend is running: `docker-compose ps`
3. Check backend logs: `docker-compose logs -f backend`
4. Review API responses in Network tab
5. Check Flower for task status: http://localhost:5555

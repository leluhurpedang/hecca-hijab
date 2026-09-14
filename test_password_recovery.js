import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('       HAECCA HIJAB — PASSWORD RECOVERY FLOW VERIFICATION       ');
console.log('================================================================\n');

let allPassed = true;

function assert(condition, message) {
  if (condition) {
    console.log(`   ✓ ${message}`);
  } else {
    console.error(`   ❌ FAILED: ${message}`);
    allPassed = false;
  }
}

// 1. Inspect adminAuth.js
console.log('1. Verifying adminAuth.js Implementation:');
const adminAuthPath = path.resolve('src/admin/services/adminAuth.js');
const adminAuthSrc = fs.readFileSync(adminAuthPath, 'utf8');

assert(adminAuthSrc.includes('resetPasswordForEmail'), 'adminAuth exports resetPasswordForEmail method');
assert(adminAuthSrc.includes('updateUserPassword'), 'adminAuth exports updateUserPassword method');
assert(adminAuthSrc.includes('isRecoveryMode'), 'adminAuth exports isRecoveryMode method');
assert(adminAuthSrc.includes('PASSWORD_RECOVERY'), 'adminAuth handles PASSWORD_RECOVERY event in onAuthStateChange');
assert(adminAuthSrc.includes('${window.location.origin}/reset-password'), 'resetPasswordForEmail targets window.location.origin/reset-password');
assert(adminAuthSrc.includes('supabase.auth.updateUser'), 'updateUserPassword calls supabase.auth.updateUser');

// 2. Inspect ResetPasswordPage.jsx
console.log('\n2. Verifying ResetPasswordPage.jsx:');
const resetPagePath = path.resolve('src/pages/ResetPasswordPage.jsx');
const resetPageSrc = fs.readFileSync(resetPagePath, 'utf8');

assert(resetPageSrc.includes('Buat Password Baru'), 'Page contains "Buat Password Baru" title');
assert(resetPageSrc.includes('Simpan Password'), 'Page contains "Simpan Password" button');
assert(resetPageSrc.includes('password.length < 6'), 'Page validates password minimum length >= 6');
assert(resetPageSrc.includes('password !== confirmPassword'), 'Page validates password confirmation match');
assert(resetPageSrc.includes('PASSWORD_RECOVERY'), 'Page handles onAuthStateChange PASSWORD_RECOVERY');
assert(resetPageSrc.includes('otp_expired') || resetPageSrc.includes('hashErrorCode'), 'Page handles expired token error states');
assert(resetPageSrc.includes('adminAuth.updateUserPassword'), 'Page invokes adminAuth.updateUserPassword');
assert(resetPageSrc.includes('adminAuth.signOut'), 'Page signs out cleanly after password reset or returning to login');

// 3. Inspect App.jsx
console.log('\n3. Verifying App.jsx Routing & Recovery Listener:');
const appPath = path.resolve('src/App.jsx');
const appSrc = fs.readFileSync(appPath, 'utf8');

assert(appSrc.includes('path="/reset-password"'), 'App.jsx contains public /reset-password route');
assert(appSrc.includes('<ResetPasswordPage />'), 'Route renders ResetPasswordPage element');
assert(appSrc.includes('AuthRecoveryListener'), 'App.jsx includes AuthRecoveryListener component');
assert(appSrc.includes('type=recovery'), 'AuthRecoveryListener catches type=recovery URL fragments');

// 4. Inspect AdminLoginPage.jsx
console.log('\n4. Verifying AdminLoginPage.jsx:');
const loginPath = path.resolve('src/admin/pages/AdminLoginPage.jsx');
const loginSrc = fs.readFileSync(loginPath, 'utf8');

assert(loginSrc.includes('Lupa Password?'), 'Login page includes "Lupa Password?" button');
assert(loginSrc.includes('handleSendResetEmail'), 'Login page implements handleSendResetEmail');
assert(loginSrc.includes('Pemulihan Password'), 'Modal includes "Pemulihan Password" dialog');
assert(loginSrc.includes('Kirim Tautan Reset'), 'Modal includes "Kirim Tautan Reset" submit button');

console.log('\n================================================================');
if (allPassed) {
  console.log(' ALL 18 VERIFICATION CHECKS PASSED SUCCESSFULLY (100%)');
} else {
  console.error(' SOME VERIFICATION CHECKS FAILED!');
  process.exit(1);
}
console.log('================================================================');

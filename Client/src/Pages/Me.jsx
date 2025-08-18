import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';
// Profile content will be inlined below
import { useAppContext } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Me = () => {
  // Advanced settings state (fix ReferenceError)
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [privacy, setPrivacy] = useState({ hideBalance: false, hideAccountNumber: false });
  const [privacyMsg, setPrivacyMsg] = useState('');
  const [showSessions, setShowSessions] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionsMsg, setSessionsMsg] = useState('');
  const [showDownload, setShowDownload] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');
  const [showTheme, setShowTheme] = useState(false);
  const [theme, setTheme] = useState({ accent: '#00C853', fontSize: 16 });
  const [themeMsg, setThemeMsg] = useState('');
  const [showSupport, setShowSupport] = useState(false);
  const [supportMsg, setSupportMsg] = useState('');
  const [showDevices, setShowDevices] = useState(false);
  const [devices, setDevices] = useState([]);
  const [devicesMsg, setDevicesMsg] = useState('');
  const [showLimits, setShowLimits] = useState(false);
  const [limits, setLimits] = useState({ daily: 0, weekly: 0 });
  const [limitsMsg, setLimitsMsg] = useState('');
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [accessibility, setAccessibility] = useState({ highContrast: false, textSize: 16 });
  const [accessibilityMsg, setAccessibilityMsg] = useState('');
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);
  const [kycStatus, setKycStatus] = useState('unverified');
  const [securityMessage, setSecurityMessage] = useState('');
  const { user, logout, setUser } = useAppContext();
  // Modal state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ firstName: '', lastName: '', email: '' });
  const [editProfileMsg, setEditProfileMsg] = useState('');
  const [changePasswordData, setChangePasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [changePasswordMsg, setChangePasswordMsg] = useState('');
  // Notification Preferences
  const [showNotifPrefs, setShowNotifPrefs] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({ email: true, sms: false, push: true });
  const [notifMsg, setNotifMsg] = useState('');
  // 2FA
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(user && user.twoFA && typeof user.twoFA.enabled === 'boolean' ? user.twoFA.enabled : false);
  const [twoFASecret, setTwoFASecret] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAMsg, setTwoFAMsg] = useState('');
  // App Settings
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [appSettings, setAppSettings] = useState({ darkMode: false, language: 'en', quickLogin: false });
  const [appSettingsMsg, setAppSettingsMsg] = useState('');
  // KYC
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycFile, setKycFile] = useState(null);
  const [kycMsg, setKycMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleFingerprintToggle = async () => {
    setFingerprintEnabled(!fingerprintEnabled);
    setSecurityMessage(fingerprintEnabled ? 'Fingerprint disabled' : 'Fingerprint enabled');
    // Call backend to enable/disable fingerprint (stub)
  };

  const handleKycUpload = async () => {
    setKycStatus('pending');
    setSecurityMessage('KYC submitted, pending verification');
    // Call backend to upload KYC (stub)
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    // ...existing code...
<div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)' }}>
  <div className="container py-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3 className="mb-0 fw-bold text-primary" style={{ letterSpacing: 1 }}>My Profile</h3>
      <button className="btn btn-outline-danger" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt me-2"></i>Log Out
      </button>
    </div>
    {user ? (
      <div
        className="position-relative mx-auto"
        style={{
          maxWidth: 420,
          animation: 'fadeInUp 0.8s cubic-bezier(.23,1.01,.32,1) both'
        }}
      >
        {/* Animated Card */}
        <div
          className="shadow-lg border-0 bg-white rounded-4 p-0 overflow-hidden"
          style={{
            transition: 'box-shadow 0.3s',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.04)'
          }}
        >
          {/* Animated Profile Image */}
          <div className="d-flex flex-column align-items-center pt-4 pb-3 position-relative" style={{ background: 'linear-gradient(90deg, #00bcd4 0%, #43e97b 100%)' }}>
            <div
              className="position-relative"
              style={{
                animation: 'bounceIn 0.7s'
              }}
            >
              <img
                src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent((user.firstName||'') + ' ' + (user.lastName||''))}&background=random&size=128`}
                alt="Profile"
                className="rounded-circle border border-3 border-white shadow"
                style={{ width: 110, height: 110, objectFit: 'cover', background: '#f8f9fa', transition: 'box-shadow 0.2s' }}
              />
              <label htmlFor="profile-upload" className="btn btn-sm btn-primary rounded-circle position-absolute" style={{ right: -8, bottom: 8, zIndex: 2, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #00C85333' }}>
                <i className="fas fa-camera text-white"></i>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new window.FileReader();
                      reader.onloadend = async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const res = await fetch('https://full-bank-app-x470.onrender.com/api/auth/profile-image', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ image: reader.result })
                          });
                          const data = await res.json();
                          if (data.profileImage) {
                            user.profileImage = data.profileImage;
                            localStorage.setItem('user', JSON.stringify(user));
                          }
                        } catch {}
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            <h4 className="mt-3 mb-0 fw-bold text-white" style={{ textShadow: '0 2px 8px #00bcd4' }}>
              {user.firstName || ''} {user.lastName || ''}
            </h4>
            <div className="text-white-50 small mb-2" style={{ textShadow: '0 1px 2px #00bcd4' }}>
              Acct: <span className="fw-semibold">{user.accountNumber || ''}</span>
            </div>
            <span className="badge bg-white text-primary px-3 py-2 fs-6 shadow-sm mb-2">{user.email}</span>
          </div>
          {/* Animated Tabs */}
          <div className="px-4 py-3">
            <ul className="nav nav-pills nav-justified mb-3" id="profileTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button className="nav-link active" id="settings-tab" data-bs-toggle="pill" data-bs-target="#settings" type="button" role="tab">
                  <i className="fas fa-cogs me-1"></i>Settings
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="security-tab" data-bs-toggle="pill" data-bs-target="#security" type="button" role="tab">
                  <i className="fas fa-shield-alt me-1"></i>Security
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="kyc-tab" data-bs-toggle="pill" data-bs-target="#kyc" type="button" role="tab">
                  <i className="fas fa-id-card me-1"></i>KYC
                </button>
              </li>
            </ul>
            <div className="tab-content" id="profileTabsContent">
              {/* Settings Tab */}
              <div className="tab-pane fade show active" id="settings" role="tabpanel">
                <button className="btn btn-outline-primary rounded-pill mb-2 w-100 text-start" onClick={() => {
                  setEditProfileData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || ''
                  });
                  setEditProfileMsg('');
                  setShowEditProfile(true);
                }}><i className="fas fa-user-cog me-2"></i>Edit Profile</button>
                <button className="btn btn-outline-secondary rounded-pill mb-2 w-100 text-start" onClick={() => {
                  setChangePasswordData({ oldPassword: '', newPassword: '' });
                  setChangePasswordMsg('');
                  setShowChangePassword(true);
                }}><i className="fas fa-lock me-2"></i>Change Password</button>
                <button className="btn btn-outline-info rounded-pill mb-2 w-100 text-start" onClick={async () => {
                  setNotifMsg('');
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('https://full-bank-app-x470.onrender.com/api/auth/notification-prefs', {
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.prefs) setNotifPrefs(data.prefs);
                  } catch {}
                  setShowNotifPrefs(true);
                }}><i className="fas fa-bell me-2"></i>Notification Preferences</button>
                <button className="btn btn-outline-dark rounded-pill mb-2 w-100 text-start" onClick={async () => {
                  setAppSettingsMsg('');
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('https://full-bank-app-x470.onrender.com/api/auth/app-settings', {
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.settings) setAppSettings(data.settings);
                  } catch {}
                  setShowAppSettings(true);
                }}><i className="fas fa-cog me-2"></i>App Settings</button>
                <button className="btn btn-outline-dark rounded-pill mb-2 w-100 text-start" onClick={() => setShowTheme(true)}><i className="fas fa-palette me-2"></i>Theme Customization</button>
              </div>
              {/* Security Tab */}
              <div className="tab-pane fade" id="security" role="tabpanel">
                <button className="btn btn-outline-warning rounded-pill mb-2 w-100 text-start" onClick={() => setShow2FA(true)}><i className="fas fa-shield-alt me-2"></i>Security & 2FA</button>
                <button className="btn btn-outline-dark rounded-pill mb-2 w-100 text-start" onClick={() => setShowPrivacy(true)}><i className="fas fa-user-secret me-2"></i>Account Privacy</button>
                <button className="btn btn-outline-dark rounded-pill mb-2 w-100 text-start" onClick={async () => {
                  setSessionsMsg('');
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('https://full-bank-app-x470.onrender.com/api/auth/sessions', {
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.sessions) setSessions(data.sessions);
                  } catch {}
                  setShowSessions(true);
                }}><i className="fas fa-desktop me-2"></i>Session Management</button>
                <button className="btn btn-outline-dark rounded-pill mb-2 w-100 text-start" onClick={async () => {
                  setDevicesMsg('');
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('https://full-bank-app-x470.onrender.com/api/auth/devices', {
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.devices) setDevices(data.devices);
                  } catch {}
                  setShowDevices(true);
                }}><i className="fas fa-link me-2"></i>Linked Devices</button>
                <button className="btn btn-outline-dark rounded-pill mb-2 w-100 text-start" onClick={() => setShowLimits(true)}><i className="fas fa-sliders-h me-2"></i>Transaction Limits</button>
                <button className="btn btn-outline-dark rounded-pill mb-2 w-100 text-start" onClick={() => setShowAccessibility(true)}><i className="fas fa-universal-access me-2"></i>Accessibility</button>
                <button className="btn btn-outline-danger rounded-pill mb-2 w-100 text-start" onClick={() => setShowDelete(true)}><i className="fas fa-user-times me-2"></i>Delete Account</button>
              </div>
              {/* KYC Tab */}
              <div className="tab-pane fade" id="kyc" role="tabpanel">
                <div className="mb-2">
                  <h5 className="fw-bold mb-2">KYC Verification</h5>
                  <p>Status: <strong>{kycStatus}</strong></p>
                  <button className="btn btn-outline-success rounded-pill mb-2 w-100 text-start" onClick={() => setShowKycModal(true)}><i className="fas fa-id-card me-2"></i>Upload ID</button>
                </div>
                <div className="mb-2">
                  <h5 className="fw-bold mb-2">Security & Fingerprint</h5>
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" id="fingerprintSwitch" checked={fingerprintEnabled} onChange={handleFingerprintToggle} />
                    <label className="form-check-label" htmlFor="fingerprintSwitch">Enable Fingerprint Sign-in</label>
                  </div>
                  {securityMessage && <div className="alert alert-info mt-2">{securityMessage}</div>}
                </div>
                <button className="btn btn-outline-info rounded-pill mb-2 w-100 text-start" onClick={() => setShowSupport(true)}><i className="fas fa-headset me-2"></i>Contact Support</button>
                <button className="btn btn-outline-dark rounded-pill mb-2 w-100 text-start" onClick={() => setShowDownload(true)}><i className="fas fa-download me-2"></i>Download My Data</button>
              </div>
            </div>
          </div>
        </div>
        {/* Modals (unchanged, keep all modal logic as before) */}
        {/* ...existing modals code... */}
      </div>
    ) : <div className="text-center py-5"><div className="spinner-border" /></div>}
  </div>
  <BottomNav />
  {/* Animations */}
  <style>{`
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(40px);}
      100% { opacity: 1; transform: translateY(0);}
    }
    @keyframes bounceIn {
      0% { transform: scale(0.7);}
      60% { transform: scale(1.1);}
      100% { transform: scale(1);}
    }
  `}</style>
</div>
  )
};

export default Me;

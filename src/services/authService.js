import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider, githubProvider } from './firebase';

class AuthService {
  async register(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      if (userData.fullName) {
        await updateProfile(user, {
          displayName: userData.fullName,
        });
      }

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: userData.fullName,
        dateOfBirth: userData.dateOfBirth || null,
        gender: userData.gender || null,
        height: userData.height || null,
        weight: userData.weight || null,
        phone: userData.phone || null,
        address: userData.address || null,
        medicalHistory: userData.medicalHistory || [],
        currentMedications: userData.currentMedications || [],
        allergies: userData.allergies || [],
        chronicDiseases: userData.chronicDiseases || [],
        bloodType: userData.bloodType || null,
        subscriptionPlan: 'free',
        subscriptionStartDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      });

      return { user, success: true };
    } catch (error) {
      console.error('Registration Error:', error);
      throw this.handleAuthError(error);
    }
  }

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLoginAt: new Date().toISOString(),
      });

      return { user: userCredential.user, success: true };
    } catch (error) {
      console.error('Login Error:', error);
      throw this.handleAuthError(error);
    }
  }

  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists, if not create new document
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName,
          photoURL: user.photoURL,
          subscriptionPlan: 'free',
          subscriptionStartDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        });
      } else {
        await updateDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date().toISOString(),
        });
      }

      return { user, success: true };
    } catch (error) {
      console.error('Google Login Error:', error);
      throw this.handleAuthError(error);
    }
  }

  async loginWithFacebook() {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName,
          photoURL: user.photoURL,
          subscriptionPlan: 'free',
          subscriptionStartDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        });
      }

      return { user, success: true };
    } catch (error) {
      console.error('Facebook Login Error:', error);
      throw this.handleAuthError(error);
    }
  }

  async loginWithGithub() {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || user.login,
          photoURL: user.photoURL,
          subscriptionPlan: 'free',
          subscriptionStartDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        });
      }

      return { user, success: true };
    } catch (error) {
      console.error('Github Login Error:', error);
      throw this.handleAuthError(error);
    }
  }

  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password Reset Error:', error);
      throw this.handleAuthError(error);
    }
  }

  async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { data: userDoc.data(), success: true };
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Get Profile Error:', error);
      throw error;
    }
  }

  async updateUserProfile(uid, updates) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      console.error('Update Profile Error:', error);
      throw error;
    }
  }

  async addMedicalRecord(uid, record) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      const userData = userDoc.data();
      
      const updatedMedicalHistory = [
        ...(userData.medicalHistory || []),
        {
          ...record,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      ];

      await updateDoc(doc(db, 'users', uid), {
        medicalHistory: updatedMedicalHistory,
        updatedAt: new Date().toISOString(),
      });

      return { success: true };
    } catch (error) {
      console.error('Add Medical Record Error:', error);
      throw error;
    }
  }

  handleAuthError(error) {
    const errorMessages = {
      'auth/email-already-in-use': 'البريد الإلكتروني مسجل بالفعل',
      'auth/invalid-email': 'البريد الإلكتروني غير صالح',
      'auth/operation-not-allowed': 'هذه العملية غير مسموحة',
      'auth/weak-password': 'كلمة المرور ضعيفة جداً',
      'auth/user-disabled': 'تم تعطيل هذا الحساب',
      'auth/user-not-found': 'المستخدم غير موجود',
      'auth/wrong-password': 'كلمة المرور غير صحيحة',
      'auth/invalid-credential': 'بيانات الدخول غير صحيحة',
      'auth/popup-closed-by-user': 'تم إغلاق نافذة تسجيل الدخول',
      'auth/network-request-failed': 'خطأ في الاتصال بالشبكة',
    };

    const message = errorMessages[error.code] || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    return new Error(message);
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
}

export default new AuthService();

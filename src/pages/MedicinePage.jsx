import React, { useState, useEffect } from 'react';
import { FiSearch, FiPill, FiAlertTriangle, FiInfo, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

export default function MedicinePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [imageFile, setImageFile] = useState(null);
  const [interactionCheck, setInteractionCheck] = useState([]);

  const searchMedicines = async (query) => {
    if (query.length < 2) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/medicine/search', 
        { query, limit: 20 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setMedicines(response.data.medicines);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchMedicines(searchQuery);
  };

  const getMedicineDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/medicine/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setSelectedMedicine(response.data.medicine);
      }
    } catch (error) {
      console.error('Get details error:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post('/api/medicine/identify', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setMedicines(response.data.identifiedMedicines);
      }
    } catch (error) {
      console.error('Image identification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToInteractionCheck = (medicine) => {
    if (!interactionCheck.find(m => m.id === medicine.id)) {
      setInteractionCheck([...interactionCheck, medicine]);
    }
  };

  const removeFromInteractionCheck = (id) => {
    setInteractionCheck(interactionCheck.filter(m => m.id !== id));
  };

  const checkInteractions = async () => {
    if (interactionCheck.length < 2) {
      alert('يرجى اختيار دوائين على الأقل للتحقق من التفاعلات');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/medicine/check-interactions',
        { medicineIds: interactionCheck.map(m => m.id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        if (response.data.interactions.length > 0) {
          alert(`⚠️ تم العثور على ${response.data.interactions.length} تفاعلات دوائية!`);
        } else {
          alert('✅ لا توجد تفاعلات دوائية معروفة بين الأدوية المختارة');
        }
      }
    } catch (error) {
      console.error('Interaction check error:', error);
    }
  };

  return (
    <div className="main-content" style={{ padding: '20px' }}>
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>
          💊 التعرف على الأدوية
        </h2>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
          <button
            onClick={() => setActiveTab('search')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'search' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'search' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: activeTab === 'search' ? '600' : '400'
            }}
          >
            🔍 بحث بالاسم
          </button>
          <button
            onClick={() => setActiveTab('image')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'image' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'image' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: activeTab === 'image' ? '600' : '400'
            }}
          >
            📷 تعرف بالصورة
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'interactions' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'interactions' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: activeTab === 'interactions' ? '600' : '400'
            }}
          >
            ⚠️ التفاعلات الدوائية
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن دواء بالاسم..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'inherit'
                }}
              />
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                <FiSearch /> بحث
              </button>
            </form>

            {isLoading && <div className="loading-spinner"></div>}

            {medicines.length > 0 && (
              <div style={{ display: 'grid', gap: '15px' }}>
                {medicines.map((med) => (
                  <div
                    key={med.id}
                    onClick={() => getMedicineDetails(med.id)}
                    style={{
                      padding: '15px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ marginBottom: '5px' }}>{med.name}</h3>
                        {med.scientificName && (
                          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                            {med.scientificName}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            background: 'var(--primary-color)', 
                            color: 'white', 
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '12px'
                          }}>
                            {med.category}
                          </span>
                          {med.prescriptionRequired && (
                            <span style={{ 
                              padding: '4px 8px', 
                              background: 'var(--warning-color)', 
                              color: 'white', 
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px'
                            }}>
                              بوصفة طبية
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToInteractionCheck(med);
                        }}
                        style={{
                          padding: '8px 12px',
                          background: 'var(--bg-tertiary)',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer'
                        }}
                      >
                        <FiAlertTriangle />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Image Upload Tab */}
        {activeTab === 'image' && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="medicine-image-upload"
              style={{ display: 'none' }}
            />
            <label
              htmlFor="medicine-image-upload"
              style={{
                display: 'inline-block',
                padding: '30px 60px',
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                background: 'var(--bg-secondary)'
              }}
            >
              <FiPill size={48} style={{ marginBottom: '10px' }} />
              <p>اضغط لرفع صورة عبوة الدواء</p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                سيقوم النظام بالتعرف على الدواء من الصورة
              </p>
            </label>
            
            {isLoading && <div className="loading-spinner" style={{ marginTop: '20px' }}></div>}
            
            {imageFile && !isLoading && (
              <p style={{ marginTop: '15px', color: 'var(--success-color)' }}>
                ✅ تم رفع الصورة بنجاح
              </p>
            )}
          </div>
        )}

        {/* Interactions Tab */}
        {activeTab === 'interactions' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3>الأدوية المختارة ({interactionCheck.length})</h3>
              {interactionCheck.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>
                  لم تقم بإختيار أي أدوية بعد. ابحث عن أدوية وأضفها للتحقق من التفاعلات.
                </p>
              ) : (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {interactionCheck.map((med) => (
                    <div
                      key={med.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <span>{med.name}</span>
                      <button
                        onClick={() => removeFromInteractionCheck(med.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--danger-color)',
                          padding: '4px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {interactionCheck.length >= 2 && (
                <button
                  onClick={checkInteractions}
                  className="btn btn-primary"
                  style={{ marginTop: '15px' }}
                >
                  <FiAlertTriangle /> التحقق من التفاعلات
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Medicine Details Modal */}
      {selectedMedicine && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedMedicine(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: '30px',
              maxWidth: '800px',
              maxHeight: '80vh',
              overflowY: 'auto',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>{selectedMedicine.name}</h2>
              <button
                onClick={() => setSelectedMedicine(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {selectedMedicine.scientificName && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                {selectedMedicine.scientificName}
              </p>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h4><FiInfo style={{ verticalAlign: 'middle' }} /> الوصف</h4>
              <p>{selectedMedicine.description}</p>
            </div>

            {selectedMedicine.uses && selectedMedicine.uses.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4><FiCheckCircle style={{ verticalAlign: 'middle' }} /> الاستخدامات</h4>
                <ul style={{ paddingRight: '20px' }}>
                  {selectedMedicine.uses.map((use, i) => (
                    <li key={i}>{use}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedMedicine.sideEffects && selectedMedicine.sideEffects.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4><FiAlertTriangle style={{ verticalAlign: 'middle' }} /> الآثار الجانبية</h4>
                <ul style={{ paddingRight: '20px' }}>
                  {selectedMedicine.sideEffects.map((sideEffect, i) => (
                    <li key={i} style={{ color: 'var(--warning-color)' }}>{sideEffect}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedMedicine.dosage && (
              <div style={{ marginBottom: '20px' }}>
                <h4>💊 الجرعة</h4>
                {selectedMedicine.dosage.adult && <p><strong>للبالغين:</strong> {selectedMedicine.dosage.adult}</p>}
                {selectedMedicine.dosage.children && <p><strong>للأطفال:</strong> {selectedMedicine.dosage.children}</p>}
              </div>
            )}

            {selectedMedicine.warnings && selectedMedicine.warnings.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4>⚠️ التحذيرات</h4>
                <ul style={{ paddingRight: '20px' }}>
                  {selectedMedicine.warnings.map((warning, i) => (
                    <li key={i} style={{ color: 'var(--danger-color)' }}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

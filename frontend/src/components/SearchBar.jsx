export default function SearchBar({ placeholder = "Buscar...", onSearch }) {
  return (
    <div style={{
      position: 'relative',
      marginBottom: '24px'
    }}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '12px 16px 12px 44px',
          border: '2px solid #2d3748',
          borderRadius: '10px',
          background: '#1a1a1a',
          color: 'white',
          fontSize: '15px',
          transition: 'all 0.3s'
        }}
        onFocus={(e) => e.target.style.borderColor = '#059669'}
        onBlur={(e) => e.target.style.borderColor = '#2d3748'}
      />
      <div style={{
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '20px',
        color: '#718096'
      }}>
        🔍
      </div>
    </div>
  );
}
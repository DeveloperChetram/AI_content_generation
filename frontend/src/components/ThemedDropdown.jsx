import { useState, useRef, useEffect } from 'react';
import { IoChevronDown } from 'react-icons/io5';

const ThemedDropdown = ({ 
  options = [], 
  selectedValue = '', 
  onChange, 
  placeholder = 'Select type',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(option => option.value === selectedValue) || null
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`themed-dropdown ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="themed-dropdown-button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        <span className="themed-dropdown-text">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <IoChevronDown 
          className={`themed-dropdown-icon ${isOpen ? 'rotated' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="themed-dropdown-menu">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`themed-dropdown-item ${
                selectedOption?.value === option.value ? 'selected' : ''
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemedDropdown;

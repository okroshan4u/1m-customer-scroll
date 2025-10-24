import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './App.css'

// Generate 1 million customer records efficiently
const generateCustomers = (count) => {
  const customers = [];
  const firstNames = ['Kiran', 'Sourav', 'Jenny', 'Narendar', 'Roshan', 'Robin', 'Purnima', 'Tidda', 'Dinesh ', 'Sabitu'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', '', 'Thapa', 'Ram', 'Roy', 'Dutta'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.com'];
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const phone = `+917600${String(i).padStart(6, '0')}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const score = Math.floor(Math.random() * 100);
    const addedBy = 'Kartikey Mishra';
    
    customers.push({
      id: i,
      name,
      phone,
      email,
      score,
      lastMessageAt: 'July 12, 2024, 12:45 PM',
      addedBy,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff6b35&color=fff&size=40`
    });
  }
  
  return customers;
};

const CustomerListApp = () => {
  const [allCustomers] = useState(() => generateCustomers(1000000));
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [displayedCustomers, setDisplayedCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const containerRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const ITEMS_PER_PAGE = 30;

  // Initial load
  useEffect(() => {
    setFilteredCustomers(allCustomers);
    setDisplayedCustomers(allCustomers.slice(0, ITEMS_PER_PAGE));
  }, [allCustomers]);

  // Debounced search
  const handleSearch = useCallback((value) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setIsLoading(true);
      const lowerValue = value.toLowerCase();
      
      // Efficient search using filter
      const filtered = value === '' 
        ? allCustomers 
        : allCustomers.filter(customer => 
            customer.name.toLowerCase().includes(lowerValue) ||
            customer.email.toLowerCase().includes(lowerValue) ||
            customer.phone.includes(value)
          );
      
      setFilteredCustomers(filtered);
      setDisplayedCustomers(filtered.slice(0, ITEMS_PER_PAGE));
      setPage(1);
      setIsLoading(false);
    }, 250);
  }, [allCustomers]);

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  // Sorting function for  asc and desc
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setIsLoading(true);
    setSortConfig({ key, direction });

    const sorted = [...filteredCustomers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredCustomers(sorted);
    setDisplayedCustomers(sorted.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setIsLoading(false);
  };

  // Infinite scroll handler goes here 
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // showing 30 customer and loading more when scrolling
    if (scrollTop + clientHeight >= scrollHeight * 0.3) {
      const nextPage = page + 1;
      const startIndex = page * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      
      if (startIndex < filteredCustomers.length) {
        setIsLoading(true);
        // Simulating slight delay for smooth loading and scrolling
        setTimeout(() => {
          setDisplayedCustomers(prev => [
            ...prev,
            ...filteredCustomers.slice(startIndex, endIndex)
          ]);
          setPage(nextPage);
          setIsLoading(false);
        }, 100);
      }
    }
  }, [page, filteredCustomers, isLoading]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div style={styles.container}>
      {/* Header section */}
      <div style={styles.header}>
        <img src="Doubletick Logo.png" height={25} alt="" />
      </div>

      {/* Title */}
      <div style={styles.titleContainer} >
        <h1 style={styles.title}>All Customers</h1>
        <span style={styles.badge}>{filteredCustomers.length}</span>
      </div>
      

      {/* Search and Filters section code goes here*/}
      <div style={styles.toolbar}>
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}><img src="test_Search-3.png" alt="" /></span>
          <input
            type="text"
            placeholder="Search Customers"
            value={searchTerm}
            id='search-input'
            onChange={onSearchChange}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterContainer}>
          <button 
            style={styles.filterButton}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span style={styles.filterIcon}><img src="test_Filter.png" width={15} alt="" /></span>
            Add Filters
          </button>
          
          {isFilterOpen && (
            <div style={styles.filterDropdown}>
              <div style={styles.filterOption}>Filter 1</div>
              <div style={styles.filterOption}>Filter 2</div>
              <div style={styles.filterOption}>Filter 3</div>
              <div style={styles.filterOption}>Filter 4</div>
            </div>
          )}
        </div>
      </div>

      {/* Table Container section goes here  */}
      <div ref={containerRef} style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.thCheckbox}>
                <input type="checkbox" style={styles.checkbox} />
              </th>
              <th style={styles.th} onClick={() => handleSort('name')}>
                Customer {getSortIcon('name')}
              </th>
              <th style={styles.th} onClick={() => handleSort('score')}>
                Score {getSortIcon('score')}
              </th>
              <th style={styles.th} onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </th>
              <th style={styles.th} onClick={() => handleSort('lastMessageAt')}>
                Last message sent at {getSortIcon('lastMessageAt')}
              </th>
              <th style={styles.th} onClick={() => handleSort('addedBy')}>
                Added by {getSortIcon('addedBy')}
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedCustomers.map((customer) => (
              <tr key={customer.id} style={styles.tr}>
                <td style={styles.tdCheckbox}>
                  <input type="checkbox" style={styles.checkbox} />
                </td>
                <td style={styles.td}>
                  <div style={styles.customerInfo}>
                    <img src={customer.avatar} alt="" style={styles.avatar} />
                    <div>
                      <div style={styles.customerName}>{customer.name}</div>
                      <div style={styles.customerPhone}>{customer.phone}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>{customer.score}</td>
                <td style={styles.td}>{customer.email}</td>
                <td style={styles.td}>{customer.lastMessageAt}</td>
                <td style={styles.td}>
                  <div style={styles.addedBy}>
                    <span style={styles.addedByIcon}><img src="test_user-3 3.png" alt="" /></span>
                    {customer.addedBy}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {isLoading && (
          <div style={styles.loader}>Loading more customers...</div>
        )}
      </div>

      {/* status bar */}
      <div style={styles.statusBar}>
        Showing {displayedCustomers.length} of {filteredCustomers.length} customers
      </div>
    </div>
  );
};

// my inline css section goes here
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '0',
  },
  header: {
    backgroundColor: '#fff',
    padding: '16px 24px',
    borderBottom: '1px solid #e9ecef',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logo: {
    width: '24px',
    height: '24px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
  },
  titleContainer: {
    padding: '10px 24px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    // backgroundColor:'gray',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#212529',
    margin: '0',
  },
  badge: {
    backgroundColor: '#e7f5ff',
    color: '#1971c2',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
  },
  toolbar: {
    padding: '0 24px 10px',
    display: 'flex',
    gap: '12px',
  },
  searchContainer: {
    position: 'relative',
    flex: '1',
    maxWidth: '400px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
    color: '#868e96',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 40px',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  filterContainer: {
    position: 'relative',
  },
  filterButton: {
    padding: '10px 16px',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
  },
  filterIcon: {
    fontSize: '14px',
  },
  filterDropdown: {
    position: 'absolute',
    top: '100%',
    left: '0',
    marginTop: '4px',
    backgroundColor: '#fff',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    minWidth: '200px',
    zIndex: '1000',
  },
  filterOption: {
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    borderBottom: '1px solid #f1f3f5',
  },
  tableContainer: {
    margin: '0 24px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'auto',
    maxHeight: 'calc(100vh - 280px)',
    border: '1px solid #e9ecef',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    position: 'sticky',
    top: '0',
    backgroundColor: '#f8f9fa',
    zIndex: '10',
    borderBottom: '2px solid #e9ecef',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#495057',
    cursor: 'pointer',
    userSelect: 'none',
  },
  thCheckbox: {
    padding: '8px 10px',
    width: '40px',
  },
  tr: {
    borderBottom: '1px solid #f1f3f5',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#495057',
  },
  tdCheckbox: {
    padding: '12px 16px',
    width: '20px',
  },
  checkbox: {
    width: '12px',
    height: '12px',
    cursor: 'pointer',
  },
  customerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
  },
  customerName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
  },
  customerPhone: {
    fontSize: '12px',
    color: '#868e96',
    marginTop: '2px',
  },
  addedBy: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#495057',
  },
  addedByIcon: {
    fontSize: '12px',
  },
  loader: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#868e96',
  },
  statusBar: {
    padding: '16px 24px',
    fontSize: '14px',
    color: '#868e96',
    textAlign: 'center',
  },
};

//hover effect section
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  tbody tr:hover {
    background-color: #f8f9fa !important;
  }
  th:hover {
    background-color: #e9ecef !important;
  }
  .filter-option:hover {
    background-color: #f8f9fa !important;
  }
`;
document.head.appendChild(styleSheet);

export default CustomerListApp;
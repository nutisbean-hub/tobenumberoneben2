let allMembers = [];

// ดึงข้อมูลสมาชิกสดจาก Google Sheets
async function loadGoogleSheetData() {
  const sheetId = '107fDA39245iaxrslUYYmRoEmo--OYj279kRvdRmg1ls';
  const gid = '1587830785';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

  try {
    const response = await fetch(csvUrl);
    const data = await response.text();
    const rows = data.split('\n').map(row => row.split(','));

    allMembers = rows.slice(1).filter(r => r.length >= 4 && r[1]).map(r => ({
      name: r[1] ? r[1].replace(/"/g, '').trim() : '',
      year: r[2] ? r[2].replace(/"/g, '').trim() : '',
      dept: r[3] ? r[3].replace(/"/g, '').trim() : '',
      role: r[4] ? r[4].replace(/"/g, '').trim() : ''
    }));
  } catch (error) {
    console.error('Error loading Google Sheet data:', error);
  }
}

// ฟังก์ชันค้นหาและควบคุมการแสดงผล (Search-First Privacy)
function handleSearch() {
  const keyword = document.getElementById('memberSearchInput').value.toLowerCase().trim();
  const placeholder = document.getElementById('searchPlaceholder');
  const tableWrapper = document.getElementById('tableWrapper');
  const tbody = document.getElementById('membersTableBody');

  if (keyword === '') {
    placeholder.style.display = 'block';
    tableWrapper.style.display = 'none';
    return;
  }

  placeholder.style.display = 'none';
  tableWrapper.style.display = 'block';

  const filtered = allMembers.filter(m => 
    m.name.toLowerCase().includes(keyword) ||
    m.year.toLowerCase().includes(keyword) ||
    m.dept.toLowerCase().includes(keyword) ||
    m.role.toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#EF4444;">ไม่พบข้อมูลสมาชิกที่ตรงกับการค้นหา</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(m => `
    <tr>
      <td><strong>${m.name}</strong></td>
      <td>${m.year}</td>
      <td>${m.dept}</td>
      <td>${m.role}</td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadGoogleSheetData();
});

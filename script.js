let allMembers = [];

// 1. ดึงข้อมูลสมาชิกจาก Google Sheets (100+ รายชื่ออัตโนมัติ)
async function fetchSheetMembers() {
  const sheetId = '107fDA39245iaxrslUYYmRoEmo--OYj279kRvdRmg1ls';
  const gid = '1587830785';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

  try {
    const response = await fetch(csvUrl);
    const data = await response.text();
    const rows = data.split('\n').map(row => row.split(','));

    // กรองและจัดเก็บข้อมูลรายชื่อ
    allMembers = rows.slice(1).filter(r => r.length >= 4 && r[1]).map(r => ({
      name: r[1] ? r[1].replace(/"/g, '').trim() : '',
      year: r[2] ? r[2].replace(/"/g, '').trim() : '',
      dept: r[3] ? r[3].replace(/"/g, '').trim() : '',
      role: r[4] ? r[4].replace(/"/g, '').trim() : ''
    }));

    displayMembers(allMembers);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    document.getElementById('membersTableBody').innerHTML = 
      '<tr><td colspan="4" style="text-align:center; color:#ef4444; padding:20px;">ไม่สามารถโหลดข้อมูลจาก Google Sheets ได้ กรุณาตรวจสอบสิทธิ์ลิงก์</td></tr>';
  }
}

// 2. แสดงผลตารางสมาชิก
function displayMembers(members) {
  const tbody = document.getElementById('membersTableBody');
  if (members.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">ไม่พบข้อมูลสมาชิกที่ค้นหา</td></tr>';
    return;
  }

  tbody.innerHTML = members.map(m => `
    <tr>
      <td>${m.name}</td>
      <td>${m.year}</td>
      <td>${m.dept}</td>
      <td>${m.role}</td>
    </tr>
  `).join('');
}

// 3. ฟังก์ชันค้นหา Real-time
function filterMembers() {
  const keyword = document.getElementById('memberSearchInput').value.toLowerCase().trim();
  const filtered = allMembers.filter(m => 
    m.name.toLowerCase().includes(keyword) ||
    m.year.toLowerCase().includes(keyword) ||
    m.dept.toLowerCase().includes(keyword) ||
    m.role.toLowerCase().includes(keyword)
  );
  displayMembers(filtered);
}

// 4. ระบบ AI Chatbot ตอบคำถามในเว็บ
function toggleChat() {
  const win = document.getElementById('chatWindow');
  win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const chatBody = document.getElementById('chatBody');
  
  // เพิ่มข้อความฝั่งผู้ใช้
  chatBody.innerHTML += `<div class="chat-msg user">${msg}</div>`;
  input.value = '';

  // จำลองระบบ AI ตอบคำถามประวัติชมรม
  setTimeout(() => {
    let reply = "ขออภัยครับ ข้อมูลส่วนนี้สามารถสอบถามเพิ่มเติมได้ที่เพจ Facebook ชมรม หรือตรวจสอบในระบบค้นหาครับ";
    const q = msg.toLowerCase();

    if (q.includes('ประธานคนแรก') || q.includes('ประธานแรก')) {
      reply = "ประธานชมรม TO BE NUMBER ONE BEN2 คนแรก คือข้อมูลอยู่ในบันทึกทำเนียบประวัติศาสตร์ชมรมปี 2024 สามารถค้นหาเพิ่มเติมในระบบตารางสมาชิกได้ครับ";
    } else if (q.includes('เบอร์') || q.includes('ติดต่อ')) {
      reply = "เบอร์ติดต่อโรงเรียนเบญจมราชรังสฤษฎิ์ ๒ คือ 038-981614 ครับ";
    } else if (q.includes('ประธานปัจจุบัน') || q.includes('2569')) {
      reply = "คณะกรรมการและประธานรุ่นปัจจุบันปี 2569 ถูกอัปเดตผ่านฟีด Instagram @tobenumberone_ben2 เรียบร้อยครับ";
    }

    chatBody.innerHTML += `<div class="chat-msg bot">${reply}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}

// โหลดข้อมูลเมื่อเปิดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
  fetchSheetMembers();
});

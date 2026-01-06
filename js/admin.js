auth.onAuthStateChanged(async user => {
  const token = await user.getIdTokenResult();
  if (!token.claims.admin) location.href = "index.html";
});

function exportExcel() {
  db.collection("results").get().then(snap => {
    const data = [];
    snap.forEach(d => data.push(d.data()));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, "ket-qua.xlsx");
  });
}

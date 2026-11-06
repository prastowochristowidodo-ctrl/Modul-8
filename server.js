
const express = require('express');
const app = express();

app.use(express.json());

let students = [];
let nextId = 1;

app.get('/api/students', (req, res) => {
    res.status(200).json({
        message: 'Berhasil mengambil data siswa',
        data: students
    });
});

app.post('/api/students', (req, res) => {
    const { name, birthPlace, birthDate, activeAddress } = req.body || {};

    const errors = [];

    if (typeof name !== 'string' || !name.trim()) {
        errors.push('Nama lengkap siswa wajib diisi');
    }

    if (typeof birthPlace !== 'string' || !birthPlace.trim()) {
        errors.push('Tempat lahir wajib diisi');
    }

    if (typeof birthDate !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        errors.push('Tanggal lahir wajib diisi dengan format YYYY-MM-DD');
    }

    if (typeof activeAddress !== 'string' || !activeAddress.trim()) {
        errors.push('Alamat aktif wajib diisi');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validasi gagal',
            errors: errors
        });
    }

    const newStudent = {
        id: nextId++,
        name: name.trim(),
        birthPlace: birthPlace.trim(),
        birthDate,
        activeAddress: activeAddress.trim()
    };

    students.push(newStudent);

    res.status(201).json({
        message: 'Data siswa berhasil ditambahkan',
        data: newStudent
    });
});

app.put('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: 'Data siswa dengan ID tersebut tidak ditemukan'
        });
    }

    const { name, activeAddress } = req.body || {};

    if (name === undefined && activeAddress === undefined) {
        return res.status(400).json({
            message: 'Masukkan nama atau alamat yang ingin diubah'
        });
    }

    if (name !== undefined) {
        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                message: 'Nama siswa tidak boleh kosong'
            });
        }

        student.name = name.trim();
    }

    if (activeAddress !== undefined) {
        if (typeof activeAddress !== 'string' || !activeAddress.trim()) {
            return res.status(400).json({
                message: 'Alamat aktif tidak boleh kosong'
            });
        }

        student.activeAddress = activeAddress.trim();
    }

    res.status(200).json({
        message: 'Data siswa berhasil diperbarui',
        data: student
    });
});

app.listen(3000, () => {
    console.log('Server Students API berjalan di http://localhost:3000');
});
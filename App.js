import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';

export default function App() {
  // State untuk menyimpan semua transaksi
  const [transaksi, setTransaksi] = useState([]);

  // State untuk input form
  const [deskripsi, setDeskripsi] = useState('');
  const [nominal, setNominal] = useState('');

  // Hitung total saldo dari semua transaksi
  const totalSaldo = transaksi.reduce((total, item) => {
    return item.tipe === 'masuk'
      ? total + item.nominal
      : total - item.nominal;
  }, 0);

  // Format angka ke format Rupiah
  const formatRupiah = (angka) => {
    return 'Rp ' + Math.abs(angka).toLocaleString('id-ID');
  };

  // Fungsi tambah transaksi
  const tambahTransaksi = (tipe) => {
    if (!deskripsi.trim()) {
      Alert.alert('Perhatian', 'Deskripsi tidak boleh kosong!');
      return;
    }
    const nominalAngka = parseInt(nominal);
    if (!nominalAngka || nominalAngka <= 0) {
      Alert.alert('Perhatian', 'Masukkan nominal yang valid!');
      return;
    }

    const transaksiaBaru = {
      id: Date.now().toString(),
      ket: deskripsi.trim(),
      nominal: nominalAngka,
      tipe: tipe, // 'masuk' atau 'keluar'
    };

    setTransaksi([transaksiaBaru, ...transaksi]);
    setDeskripsi('');
    setNominal('');
  };

  // Render setiap item di FlatList
  const renderItem = ({ item }) => (
    <View style={styles.itemTransaksi}>
      <View style={styles.itemKiri}>
        <Text style={styles.itemDeskripsi}>{item.ket}</Text>
        <Text style={styles.itemTipe}>
          {item.tipe === 'masuk' ? '▲ Pemasukan' : '▼ Pengeluaran'}
        </Text>
      </View>
      <Text
        style={[
          styles.itemNominal,
          item.tipe === 'masuk' ? styles.warnaMasuk : styles.warnaKeluar,
        ]}
      >
        {item.tipe === 'masuk' ? '+' : '-'}
        {formatRupiah(item.nominal)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== HEADER SALDO ===== */}
      <View style={styles.headerSaldo}>
        <Text style={styles.headerLabel}>Total Saldo</Text>
        <Text
          style={[
            styles.headerNominal,
            totalSaldo < 0 && styles.saldoMinus,
          ]}
        >
          {formatRupiah(totalSaldo)}
        </Text>
      </View>

      {/* ===== FORM INPUT TRANSAKSI ===== */}
      <View style={styles.formCard}>
        <Text style={styles.formJudul}>Tambah Transaksi</Text>

        <TextInput
          style={styles.input}
          placeholder='Deskripsi (contoh: "Beli Makan")'
          value={deskripsi}
          onChangeText={setDeskripsi}
        />

        <TextInput
          style={styles.input}
          placeholder="Nominal (contoh: 50000)"
          value={nominal}
          onChangeText={setNominal}
          keyboardType="numeric"
        />

        <View style={styles.barisTombol}>
          <TouchableOpacity
            style={[styles.tombol, styles.tombolMasuk]}
            onPress={() => tambahTransaksi('masuk')}
          >
            <Text style={styles.tombolTeks}>+ Pemasukan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tombol, styles.tombolKeluar]}
            onPress={() => tambahTransaksi('keluar')}
          >
            <Text style={styles.tombolTeks}>- Pengeluaran</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== LIST HISTORY (RIWAYAT) ===== */}
      <Text style={styles.judulRiwayat}>Riwayat Transaksi</Text>

      <FlatList
        data={transaksi}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.kosong}>Belum ada transaksi</Text>
        }
        contentContainerStyle={styles.listKonten}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Header Saldo
  headerSaldo: {
    backgroundColor: '#0f6e56',
    paddingVertical: 28,
    alignItems: 'center',
  },
  headerLabel: {
    color: '#9fe1cb',
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerNominal: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '600',
  },
  saldoMinus: {
    color: '#f09595',
  },

  // Form Card
  formCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formJudul: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  barisTombol: {
    flexDirection: 'row',
    gap: 8,
  },
  tombol: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tombolMasuk: {
    backgroundColor: '#1d9e75',
  },
  tombolKeluar: {
    backgroundColor: '#e24b4a',
  },
  tombolTeks: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Riwayat Transaksi
  judulRiwayat: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listKonten: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  itemTransaksi: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  itemKiri: {
    flex: 1,
  },
  itemDeskripsi: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  itemTipe: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  itemNominal: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  // STYLING WARNA (requirement penting)
  warnaMasuk: {
    color: '#1d9e75', // HIJAU untuk pemasukan
  },
  warnaKeluar: {
    color: '#e24b4a', // MERAH untuk pengeluaran
  },
  kosong: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
    paddingVertical: 32,
  },
});

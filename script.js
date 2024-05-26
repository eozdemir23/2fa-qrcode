// script.js
document.addEventListener('DOMContentLoaded', function() {
    const base32Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  
    function generateBase32Secret(length) {
      let secret = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * base32Table.length);
        secret += base32Table[randomIndex];
      }
      return secret;
    }
  
    function generateReferenceCode() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let referenceCode = '';
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        referenceCode += characters[randomIndex];
      }
      return referenceCode;
    }
  
    function generateTOTP(secret) {
      const counter = Math.floor(Date.now() / 30000);
      const hmac = CryptoJS.HmacSHA1(counter.toString(16), secret);
      const hmacResult = hmac.toString(CryptoJS.enc.Hex);
      const offset = parseInt(hmacResult.substring(hmacResult.length - 1), 16) & 0xf;
      const otp = (
        ((parseInt(hmacResult.substr(offset * 2, 8), 16) & 0x7fffffff) % 1000000)
      ).toString().padStart(6, '0');
      return otp;
    }
  
    function generateQRCode(secret) {
        const label = 'ME-Services';
        const issuer = 'ME';
        const appImageURL = 'https://freesvg.org/img/aboutme.png';
        
        const otpauthUrl = `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&image=${encodeURIComponent(appImageURL)}`;
        console.log('otpauthUrl:', otpauthUrl); // Oluşturulan otpauthUrl'i konsola yazdırma
        const qrContainer = document.getElementById("qr-code");
        QRCode.toDataURL(otpauthUrl, function (error, url) {
          if (error) {
            console.error('QR kodu oluşturulurken bir hata oluştu:', error);
          } else {
            qrContainer.innerHTML = `<img src="${url}" alt="QR Kodu">`; // QR kodunu görüntüleme
            console.log('QR kodu başarıyla oluşturuldu.');
  
            // Gizli anahtar, referans kodu ve doğrulama kodunu oluştur
            const secretCode = document.getElementById("secret-code");
            const referenceCode = document.getElementById("reference-code");
            const verificationCode = document.getElementById("verification-code");
            const secretValue = `Gizli Anahtar: ${secret}`;
            const referenceValue = `Referans Kodu: ${generateReferenceCode()}`;
            const verificationValue = `Doğrulama Kodu: ${generateTOTP(secret)}`;
            secretCode.textContent = secretValue;
            referenceCode.textContent = referenceValue;
            verificationCode.textContent = verificationValue;
          }
        });
      }
  
  
    function start() {
      const secret = generateBase32Secret(16);
      console.log("Gizli Anahtar:", secret);
      generateQRCode(secret);
    }
  
    const enable2faBtn = document.getElementById("enable-2fa-btn");
    enable2faBtn.addEventListener('click', start);
  });
  


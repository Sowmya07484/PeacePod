
"use client";

import { useState, useEffect, useCallback } from 'react';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'reflect-well-secret-key';
const LOCAL_STORAGE_KEY = 'reflect-well-encryption-status';

export function useEncryption() {
  const [isEncrypted, setIsEncrypted] = useState(false);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedValue) {
        setIsEncrypted(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error("Could not read encryption status from localStorage", error);
    }
  }, []);

  const toggleEncryption = useCallback(() => {
    const newEncryptionStatus = !isEncrypted;
    setIsEncrypted(newEncryptionStatus);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newEncryptionStatus));
    } catch (error) {
      console.error("Could not save encryption status to localStorage", error);
    }
  }, [isEncrypted]);

  const encrypt = useCallback((text: string) => {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  }, []);

  const decrypt = useCallback((ciphertext: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }, []);

  return { isEncrypted, toggleEncryption, encrypt, decrypt };
}

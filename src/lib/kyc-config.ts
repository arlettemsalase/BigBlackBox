// KYC Configuration - Change these values to control behavior
export const KYC_CONFIG = {
  // Set to true to require KYC only on first connection, false to require every time
  REQUIRE_ONLY_ONCE: false,
  
  // Mock age returned from ID verification (must be 18+ to access)
  MOCK_AGE: 22,
  
  // Minimum age required
  MINIMUM_AGE: 18,
}

export interface KYCData {
  verified: boolean
  age: number
  verifiedAt: string
  walletAddress: string
}

export const getKYCStatus = (walletAddress: string): KYCData | null => {
  if (!KYC_CONFIG.REQUIRE_ONLY_ONCE) {
    return null // Always require KYC if REQUIRE_ONLY_ONCE is false
  }
  
  const stored = localStorage.getItem(`kyc_${walletAddress}`)
  return stored ? JSON.parse(stored) : null
}

export const saveKYCStatus = (walletAddress: string, age: number) => {
  const kycData: KYCData = {
    verified: true,
    age,
    verifiedAt: new Date().toISOString(),
    walletAddress,
  }
  localStorage.setItem(`kyc_${walletAddress}`, JSON.stringify(kycData))
}

export const isAgeVerified = (age: number): boolean => {
  return age >= KYC_CONFIG.MINIMUM_AGE
}

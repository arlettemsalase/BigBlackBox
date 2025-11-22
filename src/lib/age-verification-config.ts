// Age Verification Configuration - Change these values to control behavior
// Note: This is NOT KYC - we verify age without identifying the user
export const AGE_VERIFICATION_CONFIG = {
  // Set to true to require verification only on first connection, false to require every time
  REQUIRE_ONLY_ONCE: false,
  
  // Mock age returned from ID verification (must be 18+ to access)
  MOCK_AGE: 22,
  
  // Minimum age required
  MINIMUM_AGE: 18,
}

export interface AgeVerificationData {
  verified: boolean
  age: number
  verifiedAt: string
  walletAddress: string
}

export const getAgeVerificationStatus = (walletAddress: string): AgeVerificationData | null => {
  if (!AGE_VERIFICATION_CONFIG.REQUIRE_ONLY_ONCE) {
    return null // Always require verification if REQUIRE_ONLY_ONCE is false
  }
  
  const stored = localStorage.getItem(`age_verification_${walletAddress}`)
  return stored ? JSON.parse(stored) : null
}

export const saveAgeVerificationStatus = (walletAddress: string, age: number) => {
  const verificationData: AgeVerificationData = {
    verified: true,
    age,
    verifiedAt: new Date().toISOString(),
    walletAddress,
  }
  localStorage.setItem(`age_verification_${walletAddress}`, JSON.stringify(verificationData))
}

export const isAgeVerified = (age: number): boolean => {
  return age >= AGE_VERIFICATION_CONFIG.MINIMUM_AGE
}

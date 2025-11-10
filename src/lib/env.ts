/**
 * Validação e configuração de variáveis de ambiente
 * Este arquivo centraliza todas as environment variables e suas validações
 */

/**
 * Validar variáveis de ambiente críticas
 * Em produção, loga warning mas não bloqueia (útil para builds)
 * Em runtime de produção, deveria causar erro
 */
function validateEnv() {
  const isProduction = process.env.NODE_ENV === 'production'
  const isBuild = process.env.NEXT_PHASE === 'phase-production-build'

  // NEXT_PUBLIC_SITE_URL é obrigatório em produção
  if (isProduction && !process.env.NEXT_PUBLIC_SITE_URL) {
    const message =
      '❌ NEXT_PUBLIC_SITE_URL is not set!\n' +
      'Please set it in your environment variables or .env.production file.\n' +
      'Example: NEXT_PUBLIC_SITE_URL=https://yourdomain.com\n' +
      'Falling back to: http://localhost:3000'

    // Durante build, apenas avisar (para não quebrar CI/CD)
    // Em runtime, o site ainda funcionará com fallback
    if (isBuild) {
      console.warn('⚠️ ', message)
    } else {
      console.error('❌', message)
    }
  }

  // Avisar em desenvolvimento se não estiver configurado
  if (!isProduction && !process.env.NEXT_PUBLIC_SITE_URL) {
    console.warn(
      '⚠️  NEXT_PUBLIC_SITE_URL is not set. Using fallback: http://localhost:3000\n' +
        'For production builds, please set this variable.',
    )
  }
}

// Executar validação imediatamente ao importar
if (typeof window === 'undefined') {
  // Só validar no servidor
  validateEnv()
}

/**
 * Configuração do site com valores validados
 */
export const siteConfig = {
  /**
   * URL base do site
   * @example 'https://lenildoluan.com'
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  /**
   * Nome do site
   */
  name: 'Lenildo Luan',

  /**
   * Ambiente atual
   */
  env: process.env.NODE_ENV || 'development',

  /**
   * Flag para verificar se está em produção
   */
  isProduction: process.env.NODE_ENV === 'production',

  /**
   * Flag para verificar se está em desenvolvimento
   */
  isDevelopment: process.env.NODE_ENV === 'development',
} as const

/**
 * Type-safe access to environment variables
 */
export const env = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NODE_ENV: process.env.NODE_ENV,
} as const

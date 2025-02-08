export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-06'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)
export const token = assertValue(
  "ski5FmqWApxiCcVoFnDQdhCib2FN0N72kBiEBor1cqBeAh0OOZkdV9QHC9PGDyMRkKDt00IWtSSjCzYAYKQRFZS4VsJLRJdCJ4wJOH2i6PsXMiHxf7n11DPZzxhVXCflwYZqUd2vxClgJ5yMsmh3uOoMrRgFUtUKakTN005segMKD6EvD6kW",
  'Missing environment variable: NEXT_PUBLIC_SANITY_API_TOKEN'
)
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}

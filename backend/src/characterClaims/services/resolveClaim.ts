import { Prisma } from '../../../generated/prisma/client'

interface ClaimRef {
  id: string
  userId: string
  characterId: string
}

// Links the claim's character to the claim's user if the character is still
// unclaimed, and auto-rejects any other pending claims on that character in
// the process. If the character got claimed by someone else in the meantime,
// this claim is rejected instead. Returns whether the claim was approved.
// Shared by adminApproveUser (bulk, per user) and adminResolveCharacterClaim
// (a single claim reviewed on its own).
export async function resolveClaim(
  tx: Prisma.TransactionClient, claim: ClaimRef,
): Promise<boolean> {
  const character = await tx.character.findUnique({
    where: { id: claim.characterId },
    select: { userId: true },
  })

  if (character && character.userId === null) {
    await tx.character.update({
      where: { id: claim.characterId },
      data: { userId: claim.userId, verified: true },
    })
    await tx.characterClaimRequest.update({ where: { id: claim.id }, data: { status: 'APPROVED' } })
    await tx.characterClaimRequest.updateMany({
      where: { characterId: claim.characterId, status: 'PENDING', NOT: { id: claim.id } },
      data: { status: 'REJECTED' },
    })
    await tx.image.updateMany({
      where: { idCardForCharacterId: claim.characterId },
      data: { uploadedByUserId: claim.userId },
    })
    return true
  }

  await tx.characterClaimRequest.update({ where: { id: claim.id }, data: { status: 'REJECTED' } })
  return false
}

export async function rejectClaim(tx: Prisma.TransactionClient, claimId: string): Promise<void> {
  await tx.characterClaimRequest.update({ where: { id: claimId }, data: { status: 'REJECTED' } })
}

import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  })

  if (!userSubscription) {
    return false;
  }

  const stripeCurrentPeriodEndDate = userSubscription.stripeCurrentPeriodEnd
  ? new Date(userSubscription.stripeCurrentPeriodEnd)
  : new Date(); 

  const isValid =
    userSubscription.stripePriceId 
    && stripeCurrentPeriodEndDate.getTime()! + DAY_IN_MS > Date.now()

  return !!isValid;
};

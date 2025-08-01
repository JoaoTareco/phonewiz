import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const incrementApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });

  if (userApiLimit) {

    if (Number(userApiLimit.count) === 0){
      return;
    }

    await prismadb.userApiLimit.update({
      where: { userId: userId },
      data: { count: Number(userApiLimit.count) - 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userId: userId, count: 1 },
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });

  if (!userApiLimit || Number(userApiLimit.count) > 0) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId
    }
  });

  if (!userApiLimit) {
    await prismadb.userApiLimit.create({
      data: {
        userId: userId,
        count: MAX_FREE_COUNTS
      }
    })
    return 10;
  }

  return Number(userApiLimit.count);
};

export const getBoughtTokensCount = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.userSubscription.findFirst({
    where: {
      userId
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  if (!userApiLimit) {
    return 0;
  }

  return Number(userApiLimit.post_tokens);
};

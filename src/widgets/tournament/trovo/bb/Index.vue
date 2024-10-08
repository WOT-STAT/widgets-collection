<template>
  <WidgetCardWrapper autoScale autoHeight>
    <Content :battleCount="battleCount" :currentSession="battleScores" :hide-l1="hideL1" :hide-l2="hideL2" />
  </WidgetCardWrapper>
</template>


<script setup lang="ts">
import WidgetCardWrapper from '@/components/WidgetCardWrapper.vue';

import Content from './Content.vue';
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import { useReactiveState, useReactiveTrigger, useWidgetSdk } from '@/composition/widgetSdk';
import { parseBattleResult } from '@/utils/battleResultParser';
import { useQueryParams } from '@/composition/useQueryParams';
import { useWidgetStorage } from '@/composition/useWidgetStorage';

const route = useRoute();
const hideL1 = computed(() => route.query.hideL1 === 'true');
const hideL2 = computed(() => route.query.hideL2 === 'true');

const { sdk } = useWidgetSdk();

const isInBattle = useReactiveState(sdk.data.battle.isInBattle);
const vehicle = useReactiveState(sdk.data.battle.vehicle);
const arenaId = useReactiveState(sdk.data.battle.arenaId);

const battleCount = useWidgetStorage('battleCount', 0)
const battleScores = useWidgetStorage<number[]>('battleScores', [])

const supportedBattles = useWidgetStorage('started', new Set<number>())

watch(() => [isInBattle.value, vehicle.value, arenaId.value] as const, ([isInBattle, vehicle, arenaId]) => {
  if (!isInBattle || !vehicle || !arenaId) return;

  if (vehicle.level == 10 && vehicle.class == 'heavyTank') {
    supportedBattles.value.add(arenaId)
  }
})

useReactiveTrigger(sdk.data.battle.onBattleResult, result => {
  const parsed = parseBattleResult(result);
  if (!parsed || !parsed.arenaUniqueID || !parsed.personal) return;
  if (!supportedBattles.value.has(parsed.arenaUniqueID)) return;
  supportedBattles.value.delete(parsed.arenaUniqueID)

  battleScores.value.push(parsed.personal.stats.damageDealt);
  battleCount.value++
})


</script>


<style lang="scss" scoped></style>
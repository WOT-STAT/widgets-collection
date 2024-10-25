---
title: Расширенная эффективность
---

Отображает расширенную эффективность во время боя. В ангаре показывает состояние последнего боя. 

**Результаты боя не учитываются**. Отображает только видимые во время боя показатели.

### Анимация
Переключение значений будут с эффектом прокручивания цифр.

### Возможные значения
В параметре `слоты` настройте под себя

- `Урон` – текущий урон
- `Натанковано` – количество заблокированного урона
- `Криты` – количество критических повреждений по логу событий 
- `Содействие` – сумма урона по разведданным и сбитым гусеницам
- `Обнаружено` – количество обнаруженных танков
- `Насвет` – урон по разведданным
- `Содействие по гусеницам` – урон по сбитым гусеницам
- `Поджогов` – **количество** поджогов. Считается по количеству записей в логе урона. Если танк после поджога пропадёт из засвета, а потом опять появится, поджог засчитается дважды.
- `Урон от поджогов` – урон пожарами
- `Таранов` – **количество** таранов. Считается по количеству записей в логе урона. 
- `Урон от таранов` – урон нанесённый таранами
- `Взрывов БК` – **количество** взрывов БК.
- `Урон взрывами БК` – урон от взрывов БК
- `Очки защиты базы` – количество очков защиты базы
- `Очки захвата базы` – количество очков захвата базы, считаются по логу событий с шагом в 10
- `Дистанция` – пройденное расстояние
- `Очки Чака` – сумма очков по правилам "Турнира Чака", равен `урон + 300 * количество фрагов`
- `Сумма для отметок` – сумма урона, которая засчитывается для отметок. `урон + max(насвет, гусеницы, стан))`
- `Процент отметок` – предположительный процент отметок во время боя. Высокая **точность со второго боя**.
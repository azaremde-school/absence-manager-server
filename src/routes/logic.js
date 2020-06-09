import Environment from '@/env/Environment';
import DBAccessor from '@/core/db-accessor';
import generateId from '@/util/generate-id';

import { Router } from 'express';

import { SUCCESS, ERROR, EXISTS } from '@/common/query-result';

const router = Router();

router.post('/add_group', async (req, res) => {
  const { group } = req.body;

  const _id = req.auth;

  if (!_id) {
    res.status(200).json({
      result: ERROR,
    });

    return;
  }

  await DBAccessor.db()
    .collection('groups')
    .insertOne({
      ...group,
      owner: _id
    });

  res.status(200).json({
    result: SUCCESS,
  });
});

router.post('/add_absence', async (req, res) => {
  const { groupId, memberId, absence } = req.body;

  const _id = req.auth;

  if (!_id) {
    res.status(200).json({
      result: ERROR,
    });

    return;
  }
  
  const index = (await DBAccessor.db()
    .collection('groups')
    .aggregate([
      {
        $match: {
          _id: groupId
        }
      },
      {
        $project: {
          index: { $indexOfArray: ['$members._id', memberId] },
        },
      },
    ]).toArray())[0].index;

  var exists = false;

  const _group = (await DBAccessor.db().collection('groups').find({
    _id: groupId,
  }).toArray())[0];

  if (_group) {
    const _member = _group.members.find(m => m._id === memberId);

    if (_member) {
      exists = !!_member.absences.find(a => a.date === absence.date);
    }
  }

  if (exists) {
    await DBAccessor.db()
      .collection('groups')
      .updateOne(
        {
          _id: groupId,
        },
        {
          $pull: {
            [`members.${index}.absences`]: {
              date: absence.date
            },
          },
        }
      );
  }

  await DBAccessor.db()
    .collection('groups')
    .updateOne(
      {
        _id: groupId,
      },
      {
        $push: {
          [`members.${index}.absences`]: absence,
        },
      }
    );

  res.status(200).json({
    result: SUCCESS,
  });
});

router.get('/get_groups', async (req, res) => {
  const _id = req.auth;

  if (!_id) {
    res.status(200).json({
      result: ERROR,
    });

    return;
  }

  const groups = await DBAccessor.db().collection('groups').find({
    owner: _id
  }).toArray();

  res.status(200).json(groups)
});

router.post('/edit_group', async (req, res) => {
  const _id = req.auth;

  if (!_id) {
    res.status(200).json({
      result: ERROR,
    });

    return;
  }
  
  const { groupId, removedIds, newMembers } = req.body;

  for (var i = 0; i < removedIds.length; i++) {
    await DBAccessor.db().collection('groups').updateOne({
      _id: groupId
    }, {
      $pull: {
        members: {
          _id: removedIds[i]
        },
      },
    });
  }

  for (var i = 0; i < newMembers.length; i++) {
    await DBAccessor.db().collection('groups').updateOne({
      _id: groupId
    }, {
      $push: {
        members: {
          _id: newMembers[i]._id,
          name: newMembers[i].name,
          absences: []
        },
      },
    });
  }

  res.status(200).json('')
});

export default router;

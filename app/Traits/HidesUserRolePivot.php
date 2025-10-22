<?php

namespace App\Traits;

trait HidesUserRolePivot
{
    /**
     * HIDE THE 'PIVOT' ATTRIBUTE FROM USER ROLES IN SPECIFIED RELATIONS.
     *
     * @param mixed $model The model instance.
     * @param array $relations The relations to process.
     * @return void
     */
    protected function hideUserRolePivots($model, array $relations): void
    {
        // IF THE MODEL IS A COLLECTION, PROCESS EACH ITEM
        if ($model instanceof \Illuminate\Database\Eloquent\Collection) {
            $model->each(function ($item) use ($relations) {
                $this->hideUserRolePivots($item, $relations);
            });
            return;
        }

        foreach ($relations as $relation) {
            if ($model->$relation) {
                // IF THE RELATION IS A COLLECTION (LIKE ROLES), HIDE PIVOT FROM EACH ITEM
                if ($model->$relation instanceof \Illuminate\Database\Eloquent\Collection) {
                    $model->$relation->each(function ($item) {
                        if (method_exists($item, 'makeHidden')) {
                            $item->makeHidden('pivot');
                        }
                    });
                }
                // IF THE RELATION IS A SINGLE MODEL WITH ROLES, HIDE PIVOT FROM ITS ROLES
                elseif ($model->$relation->roles) {
                    $model->$relation->roles->each(function ($role) {
                        $role->makeHidden('pivot');
                    });
                }
            }
        }
    }
} 
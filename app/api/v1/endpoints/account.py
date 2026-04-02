from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.account import (
    create_account,
    delete_account,
    get_account_by_id,
    get_account_status_summary,
    list_accounts,
    set_account_active,
    update_account,
)
from app.schemas.account import (
    AccountActiveUpdate,
    AccountCreate,
    AccountRead,
    AccountStatusResponse,
    AccountUpdate,
)
from app.utils.deps import get_db, get_tenant

router = APIRouter()


@router.post("/", response_model=AccountRead, status_code=status.HTTP_201_CREATED)
def create_account_endpoint(
    data: AccountCreate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    return create_account(db, tenant_id, data)


@router.get("/", response_model=list[AccountRead])
def list_accounts_endpoint(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    return list_accounts(db, tenant_id)


@router.get("/status", response_model=AccountStatusResponse)
def get_account_status_endpoint(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    return get_account_status_summary(db, tenant_id)


@router.get("/{account_id}", response_model=AccountRead)
def get_account_endpoint(
    account_id: int,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    account = get_account_by_id(db, tenant_id, account_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )
    return account


@router.patch("/{account_id}", response_model=AccountRead)
def update_account_endpoint(
    account_id: int,
    data: AccountUpdate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    account = update_account(db, tenant_id, account_id, data)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )
    return account


@router.patch("/{account_id}/active", response_model=AccountRead)
def set_account_active_endpoint(
    account_id: int,
    data: AccountActiveUpdate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    account = set_account_active(db, tenant_id, account_id, data.is_active)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )
    return account


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account_endpoint(
    account_id: int,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant),
):
    deleted = delete_account(db, tenant_id, account_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )
    return None
